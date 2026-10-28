import 'package:flutter/foundation.dart';
import 'package:video_player/video_player.dart';

/// ============================================================
/// IVORY - THE WEB MEDIA BRIDGE
///
/// The phone plays sounds and films straight from the app's
/// assets. A browser cannot: its video player only accepts an
/// address it can fetch. In a web build every declared asset is
/// also served over HTTPS under the app's own base address, so
/// the same key becomes a plain URL there.
///
/// One helper, both worlds: hand it the asset key exactly as the
/// phone uses it and it returns the right controller. Nothing
/// else in the house needs to know which world it is standing
/// in. If anything fails, callers keep their own quiet
/// fallbacks - media is a pleasure here, never a requirement.
/// ============================================================

/// The address a browser can fetch for a declared asset [key].
/// With base-href "/house/" this becomes
/// "https://<host>/house/assets/<key>".
String webAssetUrl(String key) {
  final Uri base = Uri.base;
  final String path = base.path.endsWith('/') ? base.path : '${base.path}/';
  return '${base.origin}${path}assets/$key';
}

/// A video player controller for [key]: an asset on the phone,
/// a fetched address in the browser. Mixed with any other audio
/// the member may already be playing.
VideoPlayerController ivoryVideoController(String key) {
  final VideoPlayerOptions opts = VideoPlayerOptions(mixWithOthers: true);
  if (kIsWeb) {
    return VideoPlayerController.networkUrl(
      Uri.parse(webAssetUrl(key)),
      videoPlayerOptions: opts,
    );
  }
  return VideoPlayerController.asset(key, videoPlayerOptions: opts);
}

// END OF FILE - lib/core/web_media.dart
