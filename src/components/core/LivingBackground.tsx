import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Canvas,
  Circle,
  RadialGradient,
  vec,
  BlurMask,
  Group,
  Paint,
  Line,
} from '@shopify/react-native-skia';
import Animated, {
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Screen } from '@theme/spacing';
import { Colors } from '@theme/colors';
import { useUIStore } from '@store/uiStore';
import { AI_STATE_CONFIGS } from '@animations/aiStates';

const W = Screen.width;
const H = Screen.height;

export function LivingBackground() {
  const { aiState, currentMode } = useUIStore();

  const blob1Opacity = useSharedValue(0.06);
  const blob2Opacity = useSharedValue(0.04);
  const dimOverlay = useSharedValue(0);

  useEffect(() => {
    const config = AI_STATE_CONFIGS[aiState];

    dimOverlay.value = withTiming(config.backgroundDimAmount, { duration: 800 });

    blob1Opacity.value = withRepeat(
      withSequence(
        withTiming(0.10, { duration: 3000 }),
        withTiming(0.04, { duration: 3000 })
      ),
      -1,
      false
    );

    blob2Opacity.value = withRepeat(
      withSequence(
        withDelay(1500, withTiming(0.08, { duration: 3000 })),
        withTiming(0.03, { duration: 3000 })
      ),
      -1,
      false
    );
  }, [aiState]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: dimOverlay.value,
  }));

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <Canvas style={StyleSheet.absoluteFillObject}>
        {/* Background base */}
        <Group>
          <Circle cx={W * 0.2} cy={H * 0.25} r={W * 0.55} color="transparent">
            <RadialGradient
              c={vec(W * 0.2, H * 0.25)}
              r={W * 0.55}
              colors={['rgba(99,102,241,0.07)', 'transparent']}
            />
          </Circle>

          <Circle cx={W * 0.85} cy={H * 0.65} r={W * 0.50} color="transparent">
            <RadialGradient
              c={vec(W * 0.85, H * 0.65)}
              r={W * 0.50}
              colors={['rgba(139,92,246,0.05)', 'transparent']}
            />
          </Circle>

          <Circle cx={W * 0.5} cy={H * 0.85} r={W * 0.35} color="transparent">
            <RadialGradient
              c={vec(W * 0.5, H * 0.85)}
              r={W * 0.35}
              colors={['rgba(0,212,255,0.04)', 'transparent']}
            />
          </Circle>
        </Group>
      </Canvas>

      {/* Dim overlay for deep think state */}
      <Animated.View
        style={[StyleSheet.absoluteFillObject, styles.dimOverlay, overlayStyle]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dimOverlay: {
    backgroundColor: '#000000',
  },
});
