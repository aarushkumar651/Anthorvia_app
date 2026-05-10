export const Springs = {
  SNAPPY: {
    damping: 18,
    stiffness: 280,
    mass: 1,
  },
  FLUID: {
    damping: 24,
    stiffness: 200,
    mass: 1,
  },
  GENTLE: {
    damping: 30,
    stiffness: 120,
    mass: 1,
  },
  ELASTIC: {
    damping: 12,
    stiffness: 300,
    mass: 0.8,
  },
  MAGNETIC: {
    damping: 16,
    stiffness: 180,
    mass: 1,
  },
  SLOW: {
    damping: 40,
    stiffness: 80,
    mass: 1.2,
  },
  ORB: {
    damping: 20,
    stiffness: 100,
    mass: 1.5,
  },
} as const;

export const Timing = {
  INSTANT: 0,
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  CINEMATIC: 800,
  SPLASH: 1200,
} as const;

export const Easing = {
  OUT_CUBIC: (t: number) => 1 - Math.pow(1 - t, 3),
  IN_OUT_CUBIC: (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  OUT_QUART: (t: number) => 1 - Math.pow(1 - t, 4),
} as const;
