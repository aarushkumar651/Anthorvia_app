import { useCallback } from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { soundService } from '@services/soundService';
import { Config } from '@constants/config';
import {
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Springs } from '@animations/springs';

export function usePressAnimation() {
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);

  const onPressIn = useCallback(() => {
    'worklet';
    scale.value = withSpring(0.96, Springs.SNAPPY);
    glow.value = withTiming(1, { duration: 100 });
  }, []);

  const onPressOut = useCallback(() => {
    'worklet';
    scale.value = withSpring(1.0, Springs.ELASTIC);
    glow.value = withTiming(0, { duration: 200 });
  }, []);

  return { scale, glow, onPressIn, onPressOut };
}

export function useHaptics() {
  const lightTap = useCallback(() => {
    if (!Config.HAPTICS_ENABLED) return;
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
  }, []);

  const confirm = useCallback(() => {
    if (!Config.HAPTICS_ENABLED) return;
    ReactNativeHapticFeedback.trigger('notificationSuccess', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
  }, []);

  const error = useCallback(() => {
    if (!Config.HAPTICS_ENABLED) return;
    ReactNativeHapticFeedback.trigger('notificationError', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
  }, []);

  const withSound = useCallback(
    async (fn: () => void) => {
      lightTap();
      await soundService.play('ui_tap');
      fn();
    },
    [lightTap]
  );

  return { lightTap, confirm, error, withSound };
}
