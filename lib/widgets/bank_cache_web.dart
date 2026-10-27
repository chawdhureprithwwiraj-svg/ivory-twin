import 'dart:html' as html;
import 'dart:typed_data';

import 'package:video_player/video_player.dart';

import 'bank_cache.dart';

/// The browser's shelf: the bank becomes a blob URL the HTML player
/// holds for as long as the room is open.
Future<CachedBank> cacheBank(String folder, String name, List<int> bytes) async {
  final html.Blob blob = html.Blob(<Uint8List>[Uint8List.fromList(bytes)],
      'audio/wav');
  final String url = html.Url.createObjectUrl(blob);
  return _BlobBank(url);
}

class _BlobBank implements CachedBank {
  _BlobBank(this.url);
  final String url;

  @override
  Future<VideoPlayerController> open() async {
    final VideoPlayerController c = VideoPlayerController.networkUrl(
      Uri.parse(url),
      videoPlayerOptions: VideoPlayerOptions(mixWithOthers: true),
    );
    await c.initialize();
    return c;
  }
}

// END OF FILE - lib/widgets/bank_cache_web.dart
