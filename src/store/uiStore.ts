import { create } from 'zustand';
import type { AIState } from '@animations/aiStates';
import type { AIModeId } from '@constants/aiModes';

interface UIState {
  aiState: AIState;
  currentMode: AIModeId;
  isKeyboardVisible: boolean;
  activeTab: string;

  setAIState: (state: AIState) => void;
  setMode: (mode: AIModeId) => void;
  setKeyboardVisible: (visible: boolean) => void;
  setActiveTab: (tab: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  aiState: 'resting',
  currentMode: 'coach',
  isKeyboardVisible: false,
  activeTab: 'chat',

  setAIState: (aiState) => set({ aiState }),
  setMode: (currentMode) => set({ currentMode }),
  setKeyboardVisible: (isKeyboardVisible) => set({ isKeyboardVisible }),
  setActiveTab: (activeTab) => set({ activeTab }),
}));
