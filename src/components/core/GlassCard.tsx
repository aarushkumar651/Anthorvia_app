import React from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { Colors, BorderRadius, Shadow } from '@theme/index';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glowColor?: string;
  padding?: number;
  noPadding?: boolean;
}

export function GlassCard({
  children,
  style,
  glowColor,
  padding = 16,
  noPadding = false,
}: GlassCardProps) {
  return (
    <View
      style={[
        styles.card,
        glowColor ? { borderColor: glowColor, ...Shadow.glow } : {},
        noPadding ? {} : { padding },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    overflow: 'hidden',
  },
});
