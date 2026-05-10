import { useEffect, useCallback } from 'react';
import { useAnalysisStore } from '@store/analysisStore';

export function useProgressiveAnalysis(autoReveal = true, delayMs = 180) {
  const {
    currentAnalysis,
    revealedMoves,
    revealNextMove,
    resetReveal,
  } = useAnalysisStore();

  useEffect(() => {
    resetReveal();
  }, [currentAnalysis?.gameId]);

  useEffect(() => {
    if (!autoReveal || !currentAnalysis) return;
    const total = currentAnalysis.moveEvaluations.length;
    if (revealedMoves >= total) return;

    const timer = setTimeout(() => {
      revealNextMove();
    }, delayMs);

    return () => clearTimeout(timer);
  }, [revealedMoves, currentAnalysis, autoReveal, delayMs, revealNextMove]);

  const visibleMoves =
    currentAnalysis?.moveEvaluations.slice(0, revealedMoves) ?? [];

  const progressPercent =
    currentAnalysis && currentAnalysis.moveEvaluations.length > 0
      ? (revealedMoves / currentAnalysis.moveEvaluations.length) * 100
      : 0;

  return { visibleMoves, revealedMoves, progressPercent };
}
