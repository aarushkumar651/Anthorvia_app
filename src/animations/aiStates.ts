export type AIState =
  | 'resting'
  | 'awakening'
  | 'listening'
  | 'processing'
  | 'generating'
  | 'deep_think'
  | 'voice_active'
  | 'celebrating'
  | 'error';

export interface AIStateConfig {
  orbScale: number;
  orbGlowIntensity: number;
  particleSpeed: number;
  particleCount: number;
  backgroundDimAmount: number;
  breathingHz: number;
  dominantColor: string;
  gridVisible: boolean;
}

export const AI_STATE_CONFIGS: Record<AIState, AIStateConfig> = {
  resting: {
    orbScale: 1.0,
    orbGlowIntensity: 0.15,
    particleSpeed: 0.3,
    particleCount: 20,
    backgroundDimAmount: 0,
    breathingHz: 0.4,
    dominantColor: '#6366F1',
    gridVisible: false,
  },
  awakening: {
    orbScale: 1.05,
    orbGlowIntensity: 0.40,
    particleSpeed: 0.6,
    particleCount: 30,
    backgroundDimAmount: 0.05,
    breathingHz: 0.6,
    dominantColor: '#00D4FF',
    gridVisible: false,
  },
  listening: {
    orbScale: 1.04,
    orbGlowIntensity: 0.50,
    particleSpeed: 0.8,
    particleCount: 35,
    backgroundDimAmount: 0.08,
    breathingHz: 0.8,
    dominantColor: '#00D4FF',
    gridVisible: false,
  },
  processing: {
    orbScale: 0.96,
    orbGlowIntensity: 0.70,
    particleSpeed: 0.2,
    particleCount: 15,
    backgroundDimAmount: 0.30,
    breathingHz: 0.2,
    dominantColor: '#8B5CF6',
    gridVisible: true,
  },
  generating: {
    orbScale: 1.06,
    orbGlowIntensity: 0.85,
    particleSpeed: 1.2,
    particleCount: 50,
    backgroundDimAmount: 0.15,
    breathingHz: 1.0,
    dominantColor: '#00D4FF',
    gridVisible: false,
  },
  deep_think: {
    orbScale: 0.92,
    orbGlowIntensity: 1.0,
    particleSpeed: 0.1,
    particleCount: 10,
    backgroundDimAmount: 0.45,
    breathingHz: 0.15,
    dominantColor: '#8B5CF6',
    gridVisible: true,
  },
  voice_active: {
    orbScale: 1.20,
    orbGlowIntensity: 0.90,
    particleSpeed: 1.5,
    particleCount: 60,
    backgroundDimAmount: 0.10,
    breathingHz: 1.2,
    dominantColor: '#00D4FF',
    gridVisible: false,
  },
  celebrating: {
    orbScale: 1.12,
    orbGlowIntensity: 1.0,
    particleSpeed: 2.0,
    particleCount: 80,
    backgroundDimAmount: 0,
    breathingHz: 1.5,
    dominantColor: '#22D3EE',
    gridVisible: false,
  },
  error: {
    orbScale: 1.0,
    orbGlowIntensity: 0.60,
    particleSpeed: 0.3,
    particleCount: 20,
    backgroundDimAmount: 0.10,
    breathingHz: 0.4,
    dominantColor: '#EF4444',
    gridVisible: false,
  },
};
