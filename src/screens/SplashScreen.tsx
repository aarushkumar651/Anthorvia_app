import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import {
  Canvas,
  Circle,
  RadialGradient,
  vec,
  BlurMask,
} from '@shopify/react-native-skia';
import { Colors, Typography, Spacing } from '@theme/index';
import { Config } from '@constants/config';

const { width: W, height: H } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish?: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const particleOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const subtitleOpacity = useSharedValue(0);
  const overallOpacity = useSharedValue(1);

  useEffect(() => {
    // Phase 1: Particles appear
    particleOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));

    // Phase 2: Logo forms
    logoOpacity.value = withDelay(800, withTiming(1, { duration: 600 }));
    logoScale.value = withDelay(800, withSpring(1.0, { damping: 18, stiffness: 120 }));

    // Phase 3: Glow bloom
    glowOpacity.value = withDelay(1200, withTiming(1, { duration: 400 }));

    // Phase 4: Title types in
    titleOpacity.value = withDelay(1600, withTiming(1, { duration: 500 }));
    titleTranslateY.value = withDelay(
      1600,
      withSpring(0, { damping: 24, stiffness: 200 })
    );

    // Phase 5: Subtitle
    subtitleOpacity.value = withDelay(2000, withTiming(1, { duration: 400 }));

    // Phase 6: Hold then transition
    if (onFinish) {
      overallOpacity.value = withDelay(
        Config.SPLASH_DURATION_MS,
        withTiming(0, { duration: 400 }, () => {
          runOnJS(onFinish)();
        })
      );
    }
  }, []);

  const particleStyle = useAnimatedStyle(() => ({ opacity: particleOpacity.value }));
  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glowOpacity.value }));
  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));
  const subtitleStyle = useAnimatedStyle(() => ({ opacity: subtitleOpacity.value }));
  const screenStyle = useAnimatedStyle(() => ({ opacity: overallOpacity.value }));

  return (
    <Animated.View style={[styles.container, screenStyle]}>
      {/* Neural particles background */}
      <Animated.View style={[StyleSheet.absoluteFillObject, particleStyle]}>
        <Canvas style={StyleSheet.absoluteFillObject}>
          <Circle cx={W * 0.5} cy={H * 0.45} r={120} color="transparent">
            <RadialGradient
              c={vec(W * 0.5, H * 0.45)}
              r={120}
              colors={['rgba(99,102,241,0.12)', 'transparent']}
            />
          </Circle>
          <Circle cx={W * 0.3} cy={H * 0.6} r={80} color="rgba(0,212,255,0.04)">
            <BlurMask blur={20} style="normal" />
          </Circle>
          <Circle cx={W * 0.7} cy={H * 0.35} r={60} color="rgba(139,92,246,0.05)">
            <BlurMask blur={15} style="normal" />
          </Circle>
        </Canvas>
      </Animated.View>

      {/* Glow behind logo */}
      <Animated.View style={[styles.glowContainer, glowStyle]}>
        <Canvas style={{ width: 200, height: 200 }}>
          <Circle cx={100} cy={100} r={80} color="transparent">
            <RadialGradient
              c={vec(100, 100)}
              r={80}
              colors={['rgba(99,102,241,0.25)', 'transparent']}
            />
          </Circle>
        </Canvas>
      </Animated.View>

      {/* Logo */}
      <Animated.Image
        source={require('../../assets/logo/anthorvia.png')}
        style={[styles.logo, logoStyle]}
        resizeMode="contain"
      />

      {/* Title */}
      <Animated.Text style={[styles.title, titleStyle]}>
        ANTHORVIA
      </Animated.Text>

      {/* Subtitle */}
      <Animated.Text style={[styles.subtitle, subtitleStyle]}>
        Chess Intelligence. Evolved.
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.void,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.base,
  },
  glowContainer: {
    position: 'absolute',
    top: H * 0.30,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.text.primary,
    letterSpacing: 8,
    marginTop: Spacing.lg,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.text.muted,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
