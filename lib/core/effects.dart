/// CC.244 - THE LIGHT LOAD (web only by design)
///
/// The house on the phone and the house in a browser are the same
/// words and the same gold, but they do not run on the same road. The
/// phone draws with Impeller on a real GPU. The browser draws with
/// CanvasKit over WebGL, where a single soft blurred glow can cost
/// more than a whole screen of text.
///
/// So the web house begins in its light dress and earns softness back
/// only if the machine proves it can carry it. In the app none of this
/// engages: the scale is always 1.0 and the richness never changes.
library;

import 'package:flutter/animation.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/scheduler.dart';

enum IvoryQuality { full, reduced, lite }

class IvoryEffects {
  IvoryEffects._();

  static final ValueNotifier<IvoryQuality> quality =
      ValueNotifier<IvoryQuality>(
    // A browser starts light: the first member screen must already be
    // smooth, not smooth after nine seconds of watching it crawl.
    kIsWeb ? IvoryQuality.lite : IvoryQuality.full,
  );

  static IvoryQuality get now => quality.value;

  /// How much of a blur's softness survives at the current quality.
  /// 1.0 everywhere in the app, always.
  static double get blurScale {
    if (!kIsWeb) return 1.0;
    if (quality.value == IvoryQuality.lite) return 0.0;
    if (quality.value == IvoryQuality.reduced) return 0.5;
    return 1.0;
  }

  /// How many sparks, dust motes and glints survive.
  static double get particleScale {
    if (!kIsWeb) return 1.0;
    if (quality.value == IvoryQuality.lite) return 0.35;
    if (quality.value == IvoryQuality.reduced) return 0.6;
    return 1.0;
  }

  /// Decorative motion - shimmer, breathing glows, idle sway - may run
  /// here. This is the first luxury the web house gives up, because a
  /// glowing card that breathes costs a full repaint of its layer on
  /// every single frame, and there are a dozen of them on a screen.
  static bool get decorativeMotion => quality.value == IvoryQuality.full;

  /// Starts a repeating controller only when decorative motion is
  /// wanted; returns it either way so the widget keeps its shape.
  /// A stopped controller paints one calm frame and costs nothing.
  static AnimationController repeatOn(
    bool on,
    AnimationController controller,
  ) {
    if (on) controller.repeat();
    return controller;
  }

  /// The richest layered glass may be drawn here.
  static bool get richnessAllowed => quality.value == IvoryQuality.full;

  /// The highest dress this platform is allowed to wear. A browser may
  /// earn back half the softness, never all of it: that is the setting
  /// that keeps a phone browser from sliding back into a crawl.
  static IvoryQuality get _ceiling =>
      kIsWeb ? IvoryQuality.reduced : IvoryQuality.full;

  static bool _started = false;
  static int _frames = 0;
  static int _windowStart = 0;
  static int _warmup = 3;
  static int _slowRuns = 0;
  static int _fastRuns = 0;

  /// Called once, when the house first opens its doors.
  static void start() {
    if (_started || !kIsWeb) return;
    _started = true;
    SchedulerBinding.instance.addPersistentFrameCallback((_) => _count());
  }

  static void _count() {
    _frames++;
    final int nowMs = DateTime.now().millisecondsSinceEpoch;
    if (_windowStart == 0) {
      _windowStart = nowMs;
      return;
    }
    final int span = nowMs - _windowStart;
    if (span < 1500) return;
    final double fps = _frames * 1000 / span;
    _frames = 0;
    _windowStart = nowMs;
    if (_warmup > 0) {
      _warmup--;
      return;
    }
    if (fps < 24) {
      _slowRuns++;
      _fastRuns = 0;
      if (_slowRuns >= 2) {
        _stepDown();
        _slowRuns = 0;
      }
    } else if (fps > 52) {
      _fastRuns++;
      _slowRuns = 0;
      if (_fastRuns >= 6) {
        _stepUp();
        _fastRuns = 0;
      }
    } else {
      _slowRuns = 0;
      _fastRuns = 0;
    }
  }

  static void _stepDown() {
    if (quality.value == IvoryQuality.full) {
      quality.value = IvoryQuality.reduced;
    } else if (quality.value == IvoryQuality.reduced) {
      quality.value = IvoryQuality.lite;
    }
  }

  static void _stepUp() {
    if (quality.value == IvoryQuality.lite) {
      if (_ceiling != IvoryQuality.lite) quality.value = IvoryQuality.reduced;
    } else if (quality.value == IvoryQuality.reduced) {
      if (_ceiling == IvoryQuality.full) quality.value = IvoryQuality.full;
    }
  }
}

// END OF FILE - lib/core/effects.dart
