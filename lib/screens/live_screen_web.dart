import 'package:flutter/material.dart';

import '../widgets/bank_cache.dart';

/// The web's honest stand-in for the Agora rooms: same door, same
/// signature, same house colours, one promise. The voice and video
/// rooms ride to the browser in the next sprint of the twin.

enum LiveMode { watch, host, call }

class LiveScreen extends StatefulWidget {
  const LiveScreen({
    super.key,
    required this.sessionId,
    required this.title,
    this.mode = LiveMode.watch,
    this.videoEnabled = true,
    this.subtitle,
    this.startedAt,
    this.guestPriceInr = 0,
    this.guestRequestsOpen = true,
    this.hostVideoEnabled = true,
    this.memberTierName,
    this.memberTierLevel = 0,
  });

  final int sessionId;
  final String title;
  final LiveMode mode;
  final bool videoEnabled;
  final String? subtitle;
  final DateTime? startedAt;
  final int guestPriceInr;
  final bool guestRequestsOpen;
  final bool hostVideoEnabled;
  final String? memberTierName;
  final int memberTierLevel;

  @override
  State<LiveScreen> createState() => _LiveScreenState();
}

class _LiveScreenState extends State<LiveScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF170A21),
      appBar: AppBar(
        backgroundColor: const Color(0xFF241033),
        elevation: 0,
        title: const Text('THE LIVE ROOMS',
            style: TextStyle(
                color: Color(0xFFFFE9B8),
                fontSize: 17,
                fontWeight: FontWeight.w900,
                letterSpacing: 2.2)),
      ),
      body: const LiveSoonRoom(),
    );
  }
}

// END OF FILE - lib/screens/live_screen_web.dart
