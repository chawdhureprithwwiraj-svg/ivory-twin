import 'dart:typed_data';

/// The twin's two hands for the wire: fetch a body, PUT a body, and
/// read bytes from a picked path. The phone uses dart:io; the browser
/// uses its own HttpRequest. Neither world sees the other's hands.
export 'net_get_io.dart' if (dart.library.html) 'net_get_web.dart';

/// Fetch [url] and answer its body as text.
Future<String> netGet(String url);

/// PUT [bytes] to [url] with [contentType]; answers the status code.
Future<int> netPut(String url, Uint8List bytes, String contentType);

/// Bytes for a picked path, or the bytes already held. On the browser
/// a path means nothing, so held bytes are the only road.
Future<Uint8List> sourceBytes(String? path, Uint8List? held);

/// PUT [bytes] with a moving progress line; answers the status code.
Future<int> netPutStream(String url, Uint8List bytes, String contentType,
    void Function(double progress) onProgress);

// END OF FILE - lib/core/net_get.dart
