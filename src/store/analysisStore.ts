import { create } from 'zustand';

export interface MoveAnalysis {
  moveNumber: number;
  san: string;
  evalBefore: number;
  evalAfter: number;
  evalLoss: number;
  classification: 'brilliant' | 'great' | 'best' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';
  bestMoveUci?: string;
}

export interface GameAnalysis {
  gameId: string;
  accuracyScore: number;
  blunderCount: number;
  mistakeCount: number;
  inaccuracyCount: number;
  openingAccuracy: number;
  middlegameAccuracy: number;
  endgameAccuracy: number;
  openingComment?: string;
  middlegameComment?: string;
  endgameComment?: string;
  keyLesson?: string;
  moveEvaluations: MoveAnalysis[];
  criticalMoments: any[];
  analysisStatus: 'pending' | 'analyzing' | 'done' | 'failed';
}

interface AnalysisState {
  currentAnalysis: GameAnalysis | null;
  currentMoveIndex: number;
  isAnalysisLoading: boolean;
  revealedMoves: number;

  setAnalysis: (analysis: GameAnalysis | null) => void;
  setMoveIndex: (index: number) => void;
  setLoading: (loading: boolean) => void;
  revealNextMove: () => void;
  resetReveal: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  currentAnalysis: null,
  currentMoveIndex: 0,
  isAnalysisLoading: false,
  revealedMoves: 0,

  setAnalysis: (currentAnalysis) => set({ currentAnalysis }),
  setMoveIndex: (currentMoveIndex) => set({ currentMoveIndex }),
  setLoading: (isAnalysisLoading) => set({ isAnalysisLoading }),

  revealNextMove: () =>
    set((state) => ({
      revealedMoves: Math.min(
        state.revealedMoves + 1,
        state.currentAnalysis?.moveEvaluations.length || 0
      ),
    })),

  resetReveal: () => set({ revealedMoves: 0 }),
}));
