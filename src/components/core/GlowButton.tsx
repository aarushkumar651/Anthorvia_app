import React, { useCallback } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Colors, BorderRadius, Typography } from '@theme/index';
import { Springs } from '@animations/springs';
import { useHaptics } from '@hooks/useMicroInteraction';
import { soundService } from '@services/soundService';

interface GlowButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  glowColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function GlowButton({
  label,
  onPress,
  variant = 'primary',
  glowColor,
  style,
  textStyle,
  disabled = false,
  size = 'md',
  icon,
}: GlowButtonProps) {
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);
  const { lightTap } = useHaptics();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: glow.value * 0.6,
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.96, Springs.SNAPPY);
    glow.value = withTiming(1, { duration: 80 });
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1.0, Springs.ELASTIC);
    glow.value = withTiming(0, { duration: 200 });
  }, []);

  const handlePress = useCallback(async () => {
    if (disabled) return;
    lightTap();
    await soundService.play('ui_tap');
    onPress();
  }, [disabled, lightTap, onPress]);

  const resolvedGlow = glowColor || variantGlow[variant];

  return (
    <AnimatedTouchable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={1}
      style={[
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        { shadowColor: resolvedGlow },
        animatedStyle,
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon && <>{icon}</>}
      <Text style={[styles.label, styles[`label_${variant}`], styles[`labelSize_${size}`], textStyle]}>
        {label}
      </Text>
    </AnimatedTouchable>
  );
}

const variantGlow: Record<string, string> = {
  primary: Colors.glow.indigo,
  secondary: Colors.glow.violet,
  ghost: Colors.glow.cyan,
  danger: '#EF4444',
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
    gap: 8,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 16,
    elevation: 8,
  },
  primary: {
    backgroundColor: Colors.glow.indigo,
  },
  secondary: {
    backgroundColor: Colors.background.elevated,
    borderWidth: 1,
    borderColor: Colors.border.glow,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border.glowCyan,
  },
  danger: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.40)',
  },
  disabled: {
    opacity: 0.4,
  },
  size_sm: { paddingHorizontal: 14, paddingVertical: 8 },
  size_md: { paddingHorizontal: 20, paddingVertical: 13 },
  size_lg: { paddingHorizontal: 28, paddingVertical: 17 },
  label: {
    ...Typography.bodyMedium,
    letterSpacing: 0.2,
  },
  label_primary: { color: '#FFFFFF' },
  label_secondary: { color: Colors.text.primary },
  label_ghost: { color: Colors.glow.cyan },
  label_danger: { color: '#EF4444' },
  labelSize_sm: { fontSize: 13 },
  labelSize_md: { fontSize: 15 },
  labelSize_lg: { fontSize: 17 },
});
