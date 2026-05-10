import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Canvas,
  Path,
  RadialGradient,
  LinearGradient,
  vec,
  Group,
  BlurMask,
  Circle,
  Skia,
} from '@shopify/react-native-skia';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { useUIStore } from '@store/uiStore';

interface AntherviaLogoProps {
  size?: number;
  animate?: boolean;
  style?: any;
}

export function AntherviaLogo({ size = 80, animate = true, style }: AntherviaLogoProps) {
  const { aiState } = useUIStore();
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.6);

  useEffect(() => {
    if (!animate) return;

    if (aiState === 'resting') {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.03, { duration: 2800 }),
          withTiming(1.0, { duration: 2800 })
        ),
        -1,
        false
      );
    } else if (aiState === 'processing' || aiState === 'deep_think') {
      scale.value = withSpring(0.96, { damping: 20, stiffness: 100 });
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(1.0, { duration: 400 }),
          withTiming(0.5, { duration: 400 })
        ),
        -1,
        false
      );
    } else if (aiState === 'generating') {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 300 }),
          withTiming(1.02, { duration: 300 })
        ),
        -1,
        false
      );
    } else if (aiState === 'celebrating') {
      scale.value = withSequence(
        withSpring(1.15, { damping: 8 }),
        withSpring(1.0, { damping: 20 })
      );
    }
  }, [aiState, animate]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <Animated.View style={[{ width: size, height: size }, style, containerStyle]}>
      <Canvas style={{ width: size, height: size }}>
        <Group>
          {/* Outer glow ring */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 2}
            color="transparent"
          >
            <RadialGradient
              c={vec(size / 2, size / 2)}
              r={size / 2}
              colors={['rgba(99,102,241,0.15)', 'transparent']}
            />
          </Circle>

          {/* Logo image rendered as path - using the logo asset */}
          {/* The actual logo SVG paths would be extracted from the logo image */}
          {/* For production: extract SVG paths from the logo file */}

          {/* Cyan glow node - left circuit endpoint */}
          <Circle cx={size * 0.08} cy={size * 0.72} r={size * 0.035} color="#00D4FF">
            <BlurMask blur={3} style="normal" />
          </Circle>

          {/* Violet glow node - right circuit endpoint */}
          <Circle cx={size * 0.92} cy={size * 0.72} r={size * 0.035} color="#8B5CF6">
            <BlurMask blur={3} style="normal" />
          </Circle>

          {/* Center core glow */}
          <Circle cx={size / 2} cy={size * 0.52} r={size * 0.08} color="rgba(99,102,241,0.3)">
            <BlurMask blur={6} style="normal" />
          </Circle>
        </Group>
      </Canvas>

      {/* Logo image overlay */}
      <View
        style={[
          StyleSheet.absoluteFillObject,
          {
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        <Animated.Image
          source={require('../../../assets/logo/anthorvia.png')}
          style={[{ width: size * 0.85, height: size * 0.85 }, glowStyle]}
          resizeMode="contain"
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({});
