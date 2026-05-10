import { StyleSheet } from 'react-native';
import { Colors } from './colors';

export const FontFamily = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semibold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
  extraBold: 'Inter-ExtraBold',
  mono: 'JetBrainsMono-Regular',
  monoBold: 'JetBrainsMono-Bold',
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  '2xl': 28,
  '3xl': 34,
  '4xl': 42,
  '5xl': 52,
} as const;

export const LineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.7,
} as const;

export const Typography = StyleSheet.create({
  display: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize['4xl'],
    color: Colors.text.primary,
    letterSpacing: -1.5,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['2xl'],
    color: Colors.text.primary,
    letterSpacing: -0.8,
  },
  heading: {
    fontFamily: FontFamily.semibold,
    fontSize: FontSize.lg,
    color: Colors.text.primary,
    letterSpacing: -0.3,
  },
  subheading: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.text.secondary,
    letterSpacing: -0.2,
  },
  body: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.text.primary,
    lineHeight: FontSize.base * LineHeight.normal,
  },
  bodyMedium: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.text.primary,
  },
  caption: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    letterSpacing: 0.1,
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.text.muted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  mono: {
    fontFamily: FontFamily.mono,
    fontSize: FontSize.sm,
    color: Colors.text.primary,
  },
  monoLarge: {
    fontFamily: FontFamily.monoBold,
    fontSize: FontSize.md,
    color: Colors.glow.cyan,
  },
});
