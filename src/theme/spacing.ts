import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
} as const;

export const Screen = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmall: SCREEN_WIDTH < 380,
  isLarge: SCREEN_WIDTH > 428,
  isTablet: SCREEN_WIDTH >= 768,
  hp: (percent: number) => SCREEN_HEIGHT * (percent / 100),
  wp: (percent: number) => SCREEN_WIDTH * (percent / 100),
} as const;

export const Layout = {
  tabBarHeight: 80,
  headerHeight: 60,
  inputBarHeight: 64,
  safeBottom: 34,
} as const;
