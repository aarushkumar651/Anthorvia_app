import {
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { AIState, AI_STATE_CONFIGS } from './aiStates';
import { Springs, Timing } from './springs';

export function useAIPresenceValues() {
  const orbScale = useSharedValue(1.0);
  const orbGlow = useSharedValue(0.15);
  const bgDim = useSharedValue(0);
  const gridOpacity = useSharedValue(0);
  const particleSpeed = useSharedValue(0.3);
  const breathingPhase = useSharedValue(0);

  return {
    orbScale,
    orbGlow,
    bgDim,
    gridOpacity,
    particleSpeed,
    breathingPhase,
  };
}

export function transitionToState(
  state: AIState,
  values: ReturnType<typeof useAIPresenceValues>
) {
  'worklet';
  const config = AI_STATE_CONFIGS[state];

  values.orbScale.value = withSpring(config.orbScale, Springs.ORB);
  values.orbGlow.value = withTiming(config.orbGlowIntensity, { duration: 600 });
  values.bgDim.value = withTiming(config.backgroundDimAmount, { duration: 800 });
  values.gridOpacity.value = withTiming(config.gridVisible ? 1 : 0, {
    duration: 1000,
  });
  values.particleSpeed.value = withTiming(config.particleSpeed, {
    duration: 500,
  });
}

export function startBreathing(
  orbScale: ReturnType<typeof useAIPresenceValues>['orbScale'],
  hz: number = 0.4
) {
  'worklet';
  const duration = (1 / hz) * 500;
  orbScale.value = withRepeat(
    withSequence(
      withTiming(1.04, { duration }),
      withTiming(1.0, { duration })
    ),
    -1,
    false
  );
}
