import { useCallback } from 'react';
import { useUIStore } from '@store/uiStore';
import { AI_MODES, AIModeId } from '@constants/aiModes';
import { soundService } from '@services/soundService';
import { useHaptics } from './useMicroInteraction';

export function useAIMode() {
  const { currentMode, setMode } = useUIStore();
  const { lightTap } = useHaptics();

  const mode = AI_MODES[currentMode];

  const switchMode = useCallback(
    async (modeId: AIModeId) => {
      if (modeId === currentMode) return;
      lightTap();
      await soundService.play('mode_switch');
      setMode(modeId);
    },
    [currentMode, lightTap, setMode]
  );

  return { currentMode, mode, switchMode };
}
