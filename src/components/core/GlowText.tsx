import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '@theme/colors';

interface GlowTextProps {
  children: string;
  style?: any;
  glowColor?: string;
  animate?: boolean;
}

export function GlowText({
  children,
  style,
  glowColor = Colors.glow.cyan,
  animate = true,
}: GlowTextProps) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (!animate) return;
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 1800 }),
        withTiming(1.0, { duration: 1800 })
      ),
      -1,
      false
    );
  }, [animate]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.Text
      style={[
        styles.text,
        { color: glowColor, textShadowColor: glowColor },
        animatedStyle,
        style,
      ]}
    >
      {children}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  text: {
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
});
