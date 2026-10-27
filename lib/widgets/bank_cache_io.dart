import 'dart:io';

import 'package:video_player/video_player.dart';

import 'bank_cache.dart';

/// The phone's shelf: the bank rests in a temporary wav file.
Future<CachedBank> cacheBank(String folder, String name, List<int> bytes) async {
  final Directory dir =
      await Directory('${Directory.systemTemp.path}/$folder')
          .create(recursive: true);
  final File f = File('${dir.path}/$name');
  await f.writeAsBytes(bytes, flush: true);
  return _FileBank(f);
}

class _FileBank implements CachedBank {
  _FileBank(this.f);
  final File f;

  @override
  Future<VideoPlayerController> open() async {
    final VideoPlayerController c = VideoPlayerController.file(
      f,
      videoPlayerOptions: VideoPlayerOptions(mixWithOthers: true),
    );
    await c.initialize();
    return c;
  }
}

// END OF FILE - lib/widgets/bank_cache_io.dart
