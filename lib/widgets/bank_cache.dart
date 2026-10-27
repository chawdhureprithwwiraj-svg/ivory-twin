import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';

/// The twin's sound shelf: one API for both worlds.
/// On the phone a bank of synthesised wav bytes rests in a temporary
/// file; in a browser the same bytes become a blob URL the HTML player
/// can hold. Neither world ever sees the other's hands.
export 'bank_cache_io.dart' if (dart.library.html) 'bank_cache_web.dart';

/// A cached bank of wav spans, ready to open players from.
abstract class CachedBank {
  /// One initialised player over the whole bank.
  Future<VideoPlayerController> open();
}

/// Paints the web's honest notice where the live rooms will rise.
class LiveSoonRoom extends StatelessWidget {
  const LiveSoonRoom({super.key});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: const Color(0xFF241033),
      child: Center(
        child: Padding(
          padding: const EdgeInsets.all(28),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: const <Widget>[
              Text('THE LIVE ROOMS',
                  style: TextStyle(
                      color: Color(0xFFFFE9B8),
                      fontSize: 20,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 2.4)),
              SizedBox(height: 12),
              Text(
                'Voice and video moments are being carried to the web '
                'in the next sprint of the twin. Until then the app '
                'holds them, exactly as it always has.',
                textAlign: TextAlign.center,
                style: TextStyle(color: Color(0xCCFFE9B8), height: 1.6),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// END OF FILE - lib/widgets/bank_cache.dart
