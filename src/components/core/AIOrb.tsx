import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Canvas,
  Circle,
  RadialGradient,
  vec,
  BlurMask,
  Group,
} from '@shopify/react-native-skia';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  useDerivedValue,
} from 'react-native-reanimated';
import { useUIStore } from '@store/uiStore';
import { AI_STATE_CONFIGS } from '@animations/aiStates';
import { Colors } from '@theme/colors';

interface AIOrb {
  size?: number;
  style?: any;
}

export function AIOrb({ size = 80, style }: AIOrb) {
  const { aiState } = useUIStore();
  const scale = useSharedValue(1);
  const glowIntensity = useSharedValue(0.15);
  const innerScale = useSharedValue(1);

  useEffect(() => {
    const config = AI_STATE_CONFIGS[aiState];

    glowIntensity.value = withTiming(config.orbGlowIntensity, { duration: 600 });

    if (aiState === 'resting' || aiState === 'awakening') {
      const hz = config.breathingHz;
      const duration = (1 / hz) * 500;
      scale.value = withRepeat(
        withSequence(
          withTiming(1.04, { duration }),
          withTiming(1.0, { duration })
        ),
        -1,
        false
      );
    } else if (aiState === 'processing') {
      scale.value = withSpring(0.92, { damping: 20, stiffness: 100 });
      innerScale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 300 }),
          withTiming(0.95, { duration: 300 })
        ),
        -1,
        false
      );
    } else if (aiState === 'generating') {
      scale.value = withSpring(1.06, { damping: 15, stiffness: 150 });
    } else if (aiState === 'voice_active') {
      scale.value = withSpring(1.20, { damping: 20, stiffness: 100 });
    } else if (aiState === 'celebrating') {
      scale.value = withSequence(
        withSpring(1.15, { damping: 10, stiffness: 200 }),
        withSpring(1.0, { damping: 20, stiffness: 150 })
      );
    } else if (aiState === 'error') {
      scale.value = withSequence(
        withTiming(1.05, { duration: 100 }),
        withTiming(0.98, { duration: 100 }),
        withSpring(1.0)
      );
    }
  }, [aiState]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const config = AI_STATE_CONFIGS[aiState];
  const dominantColor = config.dominantColor;

  return (
    <Animated.View style={[styles.container, { width: size, height: size }, style, containerStyle]}>
      <Canvas style={{ width: size, height: size }}>
        <Group>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 2}
            color="transparent"
          >
            <RadialGradient
              c={vec(size / 2, size / 2)}
              r={size / 2}
              colors={[
                `${dominantColor}30`,
                `${dominantColor}10`,
                'transparent',
              ]}
            />
          </Circle>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 8}
            color={`${dominantColor}15`}
          >
            <BlurMask blur={8} style="normal" />
          </Circle>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={size / 4}
            color={`${dominantColor}40`}
          >
            <BlurMask blur={4} style="normal" />
          </Circle>
        </Group>
      </Canvas>

      <View
        style={[
          styles.border,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: `${dominantColor}50`,
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  border: {
    position: 'absolute',
    borderWidth: 1,
  },
});
