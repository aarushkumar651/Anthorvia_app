import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  FadeIn,
} from 'react-native-reanimated';
import {
  Canvas,
  Circle,
  RadialGradient,
  vec,
  BlurMask,
} from '@shopify/react-native-skia';
import { LivingBackground } from '@components/core/LivingBackground';
import { AntherviaLogo } from '@components/core/AntherviaLogo';
import { Colors, Typography, Spacing, Screen, Layout } from '@theme/index';
import { useUIStore } from '@store/uiStore';
import { soundService } from '@services/soundService';

const ORB_SIZE = Screen.width * 0.55;

export function VoiceScreen() {
  const insets = useSafeAreaInsets();
  const [isActive, setIsActive] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { setAIState } = useUIStore();

  const orbScale = useSharedValue(1);
  const orbGlow = useSharedValue(0.3);
  const ring1Scale = useSharedValue(1);
  const ring2Scale = useSharedValue(1);
  const ring1Opacity = useSharedValue(0);
  const ring2Opacity = useSharedValue(0);

  const startBreathing = () => {
    orbScale.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 1200 }),
        withTiming(1.0, { duration: 1200 })
      ),
      -1,
      false
    );
    orbGlow.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1200 }),
        withTiming(0.4, { duration: 1200 })
      ),
      -1,
      false
    );
    ring1Opacity.value = withTiming(0.4, { duration: 400 });
    ring2Opacity.value = withTiming(0.2, { duration: 600 });
    ring1Scale.value = withRepeat(
      withSequence(
        withTiming(1.4, { duration: 1800 }),
        withTiming(1.0, { duration: 200 })
      ),
      -1,
      false
    );
    ring2Scale.value = withRepeat(
      withSequence(
        withTiming(1.0, { duration: 600 }),
        withTiming(1.7, { duration: 2000 }),
        withTiming(1.0, { duration: 200 })
      ),
      -1,
      false
    );
  };

  const stopBreathing = () => {
    orbScale.value = withSpring(1.0);
    orbGlow.value = withTiming(0.3, { duration: 400 });
    ring1Opacity.value = withTiming(0, { duration: 400 });
    ring2Opacity.value = withTiming(0, { duration: 400 });
  };

  const handleOrbPress = async () => {
    if (isActive) {
      setIsActive(false);
      setAIState('resting');
      stopBreathing();
      setTranscript('');
    } else {
      setIsActive(true);
      setAIState('voice_active');
      await soundService.play('voice_activate');
      startBreathing();
      setTranscript('Voice coach is ready. Speak now...');
    }
  };

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: orbScale.value }],
  }));

  const ring1Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring1Scale.value }],
    opacity: ring1Opacity.value,
  }));

  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring2Scale.value }],
    opacity: ring2Opacity.value,
  }));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LivingBackground />

      {/* Header */}
      <View style={styles.header}>
        <AntherviaLogo size={36} animate={false} />
        <Text style={styles.headerTitle}>Voice Coach</Text>
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, { backgroundColor: isActive ? Colors.status.win : Colors.text.muted }]} />
          <Text style={styles.statusText}>{isActive ? 'Active' : 'Ready'}</Text>
        </View>
      </View>

      {/* Main orb area */}
      <View style={styles.orbArea}>
        {/* Outer rings */}
        <Animated.View style={[styles.ring, { width: ORB_SIZE * 1.7, height: ORB_SIZE * 1.7, borderRadius: ORB_SIZE * 1.7 / 2, borderColor: `${Colors.glow.cyan}30` }, ring2Style]} />
        <Animated.View style={[styles.ring, { width: ORB_SIZE * 1.3, height: ORB_SIZE * 1.3, borderRadius: ORB_SIZE * 1.3 / 2, borderColor: `${Colors.glow.indigo}50` }, ring1Style]} />

        {/* Main orb */}
        <Animated.View style={orbStyle}>
          <TouchableOpacity
            style={[styles.orb, { width: ORB_SIZE, height: ORB_SIZE, borderRadius: ORB_SIZE / 2 }]}
            onPress={handleOrbPress}
            activeOpacity={0.9}
          >
            <Canvas style={{ width: ORB_SIZE, height: ORB_SIZE }}>
              <Circle cx={ORB_SIZE / 2} cy={ORB_SIZE / 2} r={ORB_SIZE / 2 - 2} color="transparent">
                <RadialGradient
                  c={vec(ORB_SIZE / 2, ORB_SIZE / 2)}
                  r={ORB_SIZE / 2}
                  colors={[
                    isActive ? 'rgba(0,212,255,0.20)' : 'rgba(99,102,241,0.15)',
                    isActive ? 'rgba(99,102,241,0.10)' : 'rgba(139,92,246,0.08)',
                    'transparent',
                  ]}
                />
              </Circle>
              <Circle
                cx={ORB_SIZE / 2}
                cy={ORB_SIZE / 2}
                r={ORB_SIZE / 4}
                color={isActive ? 'rgba(0,212,255,0.25)' : 'rgba(99,102,241,0.20)'}
              >
                <BlurMask blur={20} style="normal" />
              </Circle>
            </Canvas>

            {/* Center icon */}
            <View style={StyleSheet.absoluteFillObject}>
              <View style={styles.orbCenter}>
                <Text style={styles.orbIcon}>{isActive ? '◉' : '◎'}</Text>
                <Text style={styles.orbLabel}>
                  {isActive ? 'Tap to stop' : 'Tap to speak'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Transcript area */}
      <Animated.View entering={FadeIn.duration(400)} style={styles.transcriptArea}>
        {transcript ? (
          <Text style={styles.transcript}>{transcript}</Text>
        ) : (
          <Text style={styles.transcriptPlaceholder}>
            Touch the orb to begin speaking with your AI coach
          </Text>
        )}
      </Animated.View>

      {/* Coming soon note */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.base) + Layout.tabBarHeight }]}>
        <Text style={styles.footerText}>
          Full voice AI • Coming soon for Pro users
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.void },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  headerTitle: { ...Typography.heading, color: Colors.text.primary },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { ...Typography.caption, color: Colors.text.muted },
  orbArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ring: {
    position: 'absolute',
    borderWidth: 1,
  },
  orb: {
    backgroundColor: Colors.background.elevated,
    borderWidth: 1,
    borderColor: Colors.border.glow,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  orbCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  orbIcon: {
    fontSize: 40,
    color: Colors.glow.cyan,
  },
  orbLabel: {
    ...Typography.caption,
    color: Colors.text.muted,
    letterSpacing: 1,
  },
  transcriptArea: {
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.lg,
    minHeight: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transcript: {
    ...Typography.body,
    color: Colors.text.primary,
    textAlign: 'center',
    lineHeight: 24,
  },
  transcriptPlaceholder: {
    ...Typography.body,
    color: Colors.text.muted,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
  },
  footerText: {
    ...Typography.caption,
    color: Colors.text.muted,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});
