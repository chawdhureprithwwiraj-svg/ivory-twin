import 'dart:typed_data';

import 'package:supabase_flutter/supabase_flutter.dart';

import '../core/ivory_errors.dart';
import '../core/net_get.dart';
import 'dart:convert';
import 'package:flutter/foundation.dart' show kIsWeb;
import '../core/supabase_config.dart';

class B2FullError extends Error {
  B2FullError(this.usedGb);
  final double usedGb;
}

class B2MediaError implements Exception {
  B2MediaError(this.op, this.detail);
  final String op;
  final String detail;
  @override
  String toString() => 'Private B2 $op failed: $detail';
}

/// Private Backblaze B2 media. Keys and signing stay in Supabase; the
/// phone only receives a short-lived upload or entitled-reader URL.
class B2MediaService {
  B2MediaService._();
  static final B2MediaService instance = B2MediaService._();

  static const int imageLimit = 48 * 1024 * 1024;
  static const int fileLimit = 5000000000;

  /// The web door for media: same origin, so no preflight blocks it.
  Future<Map<String, dynamic>> _callThroughTheDoor(
    String op,
    Map<String, dynamic> body,
  ) async {
    final Session? session = Supabase.instance.client.auth.currentSession;
    final String token = session?.accessToken ?? '';
    final String raw;
    try {
      raw = await netPostJson(
        '/api/b2-media',
        jsonEncode(<String, dynamic>{'op': op, ...body}),
        <String, String>{
          'apikey': SupabaseConfig.anonKey,
          if (token.isNotEmpty) 'Authorization': 'Bearer $token',
        },
      );
    } catch (e) {
      throw B2MediaError(op, 'The door at /api/b2-media failed: $e');
    }
    dynamic envelope;
    try {
      envelope = jsonDecode(raw);
    } catch (_) {
      throw B2MediaError(op,
          'The door at /api/b2-media did not answer in JSON.');
    }
    final int status =
        envelope is Map ? ((envelope['status'] as num?)?.toInt() ?? 0) : 0;
    final dynamic data = envelope is Map ? envelope['data'] : null;
    if (status == 0) {
      final String why =
          data is Map ? (data['error'] ?? data).toString() : '$data';
      throw B2MediaError(op, 'The door at /api/b2-media failed: $why');
    }
    if (status != 200) {
      if (data is Map && data['error'] == 'b2_full') {
        throw B2FullError(((data['used'] as num?) ?? 0) / 1000000000);
      }
      final String why = data is Map
          ? (data['error'] ?? data['message'] ?? data).toString()
          : '$data';
      throw B2MediaError(op, 'b2-media answered HTTP $status: $why');
    }
    if (data is Map<String, dynamic>) return data;
    if (data is Map) return Map<String, dynamic>.from(data);
    throw B2MediaError(op,
        'b2-media replied with ${data.runtimeType}, not an object.');
  }

  Future<Map<String, dynamic>> _call(
    String op,
    Map<String, dynamic> body,
  ) async {
    // CC.244: a browser cannot reach the edge function (its preflight
    // is a bare 405), so on the web the house knocks on its own door.
    if (kIsWeb) return _callThroughTheDoor(op, body);
    dynamic response;
    try {
      response = await Supabase.instance.client.functions.invoke(
        'b2-media',
        method: HttpMethod.post,
        body: <String, dynamic>{'op': op, ...body},
      );
    } catch (e) {
      if (e is FunctionException) {
        final Object? details = e.details;
        if (details is Map && details['error'] == 'b2_full') {
          throw B2FullError(((details['used'] as num?) ?? 0) / 1000000000);
        }
        if (e.status == 404) {
          throw B2MediaError(op, 'The b2-media function is not deployed yet.');
        }
      }
      throw B2MediaError(op, adminDetail(e));
    }

    final int status = (response.status as int?) ?? 0;
    final dynamic data = response.data;
    if (status != 200) {
      if (data is Map && data['error'] == 'b2_full') {
        throw B2FullError(((data['used'] as num?) ?? 0) / 1000000000);
      }
      final String message = data is Map
          ? (data['error'] ?? data['message'] ?? 'Request refused').toString()
          : (data?.toString() ?? 'No reply');
      throw B2MediaError(op, 'HTTP $status: $message');
    }
    if (data is Map<String, dynamic>) return data;
    if (data is Map) return Map<String, dynamic>.from(data);
    throw B2MediaError(op, 'The function returned an invalid response.');
  }

  String _contentType(String name) {
    final String n = name.toLowerCase();
    if (n.endsWith('.jpg') || n.endsWith('.jpeg')) return 'image/jpeg';
    if (n.endsWith('.png')) return 'image/png';
    if (n.endsWith('.webp')) return 'image/webp';
    if (n.endsWith('.gif')) return 'image/gif';
    if (n.endsWith('.mp4')) return 'video/mp4';
    if (n.endsWith('.m4v')) return 'video/x-m4v';
    if (n.endsWith('.mov')) return 'video/quicktime';
    if (n.endsWith('.mkv')) return 'video/x-matroska';
    if (n.endsWith('.webm')) return 'video/webm';
    if (n.endsWith('.mp3')) return 'audio/mpeg';
    if (n.endsWith('.m4a')) return 'audio/mp4';
    if (n.endsWith('.aac')) return 'audio/aac';
    if (n.endsWith('.wav')) return 'audio/wav';
    if (n.endsWith('.ogg') || n.endsWith('.opus')) return 'audio/ogg';
    if (n.endsWith('.flac')) return 'audio/flac';
    if (n.endsWith('.amr')) return 'audio/amr';
    return 'application/octet-stream';
  }

  String _safeName(String name) {
    String safe = name.replaceAll(RegExp(r'[^A-Za-z0-9._-]'), '_');
    if (safe.length > 120) safe = safe.substring(safe.length - 120);
    return safe.isEmpty ? 'media.bin' : safe;
  }

  Stream<List<int>> _chunks(Uint8List bytes, int slice) async* {
    for (int start = 0; start < bytes.length; start += slice) {
      final int end = start + slice > bytes.length
          ? bytes.length
          : start + slice;
      yield bytes.sublist(start, end);
    }
  }

  Future<String> _send({
    required String url,
    required String key,
    required String contentType,
    required int size,
    required Uint8List body,
    void Function(double progress)? onProgress,
  }) async {
    try {
      final int code = await netPutStream(
          url, body, contentType, (double p) => onProgress?.call(p));
      if (code < 200 || code >= 300) {
        throw B2MediaError('upload', 'B2 refused the file (HTTP $code).');
      }
      onProgress?.call(1);
      return key;
    } on B2MediaError {
      rethrow;
    } catch (e) {
      throw B2MediaError('upload', adminDetail(e));
    }
  }

  Future<String> uploadBytes({
    required Uint8List bytes,
    required String name,
    required String kind,
    void Function(double progress)? onProgress,
  }) async {
    if (bytes.isEmpty) {
      throw B2MediaError('upload', 'That file is empty. Pick it again.');
    }
    final String safe = _safeName(name);
    const int slice = 256 * 1024;
    return _uploadMemory(
      bytes: bytes,
      name: safe,
      kind: kind,
      onProgress: onProgress,
      slice: slice,
    );
  }

  Future<String> _uploadMemory({
    required Uint8List bytes,
    required String name,
    required String kind,
    required int slice,
    void Function(double progress)? onProgress,
  }) async {
    const Set<String> kinds = <String>{
      'image',
      'cover',
      'video',
      'audio',
      'attachment',
    };
    if (!kinds.contains(kind)) {
      throw B2MediaError('upload', 'That media type is not allowed.');
    }
    final int size = bytes.length;
    if (size > fileLimit) {
      throw B2MediaError(
        'upload',
        'B2 single-file uploads must be under 5 GB. Choose R2 for a larger file.',
      );
    }
    final String type = _contentType(name);
    if ((kind == 'image' || kind == 'cover') &&
        (!type.startsWith('image/') || size > imageLimit)) {
      throw B2MediaError(
        'upload',
        'Choose a JPEG, PNG, WebP or GIF image under 48 MB.',
      );
    }
    final Map<String, dynamic> signed = await _call('put', <String, dynamic>{
      'kind': kind,
      'name': name,
      'size': size,
      'content_type': type,
    });
    final String? url = signed['url'] as String?;
    final String? key = signed['key'] as String?;
    if (url == null || url.isEmpty || key == null || key.isEmpty) {
      throw B2MediaError('upload', 'B2 did not return an upload link.');
    }
    return _send(
      url: url,
      key: key,
      contentType: type,
      size: size,
      body: bytes,
      onProgress: onProgress,
    );
  }

  Future<String> uploadFile({
    required String path,
    required String name,
    required String kind,
    void Function(double progress)? onProgress,
  }) async {
    final Uint8List bodyBytes = await sourceBytes(path, null);
    final int size = bodyBytes.length;
    final String safe = _safeName(name);
    const Set<String> kinds = <String>{'video', 'audio', 'attachment'};
    if (!kinds.contains(kind)) {
      throw B2MediaError('upload', 'That file type cannot be streamed here.');
    }
    if (size <= 0 || size > fileLimit) {
      throw B2MediaError(
        'upload',
        'B2 single-file uploads must be under 5 GB. Choose R2 for a larger file.',
      );
    }
    final String contentType = _contentType(safe);
    final Map<String, dynamic> signed = await _call('put', <String, dynamic>{
      'kind': kind,
      'name': safe,
      'size': size,
      'content_type': contentType,
    });
    final String? url = signed['url'] as String?;
    final String? key = signed['key'] as String?;
    if (url == null || url.isEmpty || key == null || key.isEmpty) {
      throw B2MediaError('upload', 'B2 did not return an upload link.');
    }
    return _send(
      url: url,
      key: key,
      contentType: contentType,
      size: size,
      body: bodyBytes,
      onProgress: onProgress,
    );
  }

  Future<int?> usedBytes() async {
    try {
      final Map<String, dynamic> result = await _call(
        'usage',
        <String, dynamic>{},
      );
      return (result['used'] as num?)?.toInt();
    } catch (_) {
      return null;
    }
  }

  Future<String?> openPostMedia(int postId, {String field = 'media'}) async {
    try {
      final Map<String, dynamic> result = await _call('get', <String, dynamic>{
        'post_id': postId,
        'field': field,
      });
      return result['url'] as String?;
    } catch (_) {
      return null;
    }
  }

  Future<Map<int, String>> signPreviewUrls(List<int> postIds) async {
    if (postIds.isEmpty) return <int, String>{};
    final Map<String, dynamic> result = await _call(
      'sign_previews',
      <String, dynamic>{'post_ids': postIds.take(50).toList()},
    );
    final Map<int, String> urls = <int, String>{};
    final List<dynamic> items =
        result['items'] as List<dynamic>? ?? <dynamic>[];
    for (final dynamic item in items) {
      if (item is! Map) continue;
      final int? id = (item['id'] as num?)?.toInt();
      final String? url = item['url'] as String?;
      if (id != null && url != null && url.startsWith('https://')) {
        urls[id] = url;
      }
    }
    return urls;
  }
}

// END OF FILE - lib/services/b2_media_service.dart
