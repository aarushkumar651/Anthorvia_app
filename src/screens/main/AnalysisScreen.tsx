import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useQuery } from '@tanstack/react-query';
import { LivingBackground } from '@components/core/LivingBackground';
import { GlassCard } from '@components/core/GlassCard';
import { GlowButton } from '@components/core/GlowButton';
import { Skeleton } from '@components/core/Skeleton';
import { IntelligentEmptyState } from '@components/core/IntelligentEmptyState';
import { Colors, Typography, Spacing, BorderRadius, Layout } from '@theme/index';
import { gamesApi } from '@api/analysis';
import { useProgressiveAnalysis } from '@hooks/useProgressiveAnalysis';
import { useAnalysisStore } from '@store/analysisStore';

const CLASSIFICATION_COLORS: Record<string, string> = {
  brilliant: '#FFD700',
  great: '#22D3EE',
  best: '#10B981',
  good: '#6366F1',
  inaccuracy: '#F59E0B',
  mistake: '#EF8C44',
  blunder: '#EF4444',
};

export function AnalysisScreen() {
  const insets = useSafeAreaInsets();
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const { currentAnalysis } = useAnalysisStore();
  const { visibleMoves, progressPercent } = useProgressiveAnalysis(true, 120);

  const { data: gamesData, isLoading: gamesLoading } = useQuery({
    queryKey: ['games-list'],
    queryFn: () => gamesApi.getGames(1),
    staleTime: 1000 * 60 * 5,
  });

  const games = gamesData?.items || [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LivingBackground />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analysis</Text>
        <Text style={styles.headerSubtitle}>Game Intelligence</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Layout.tabBarHeight + Spacing['3xl'] },
        ]}
      >
        {/* Active analysis */}
        {currentAnalysis && (
          <Animated.View entering={FadeIn.duration(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>Current Analysis</Text>

            {/* Accuracy cards */}
            <View style={styles.accuracyRow}>
              <AccuracyCard label="Overall" value={currentAnalysis.accuracyScore} color={Colors.glow.cyan} />
              <AccuracyCard label="Opening" value={currentAnalysis.openingAccuracy} color={Colors.glow.blue} />
              <AccuracyCard label="Middlegame" value={currentAnalysis.middlegameAccuracy} color={Colors.glow.indigo} />
              <AccuracyCard label="Endgame" value={currentAnalysis.endgameAccuracy} color={Colors.glow.violet} />
            </View>

            {/* Error counts */}
            <GlassCard style={styles.errorRow}>
              <ErrorChip label="Blunders" count={currentAnalysis.blunderCount} color={Colors.status.loss} />
              <ErrorChip label="Mistakes" count={currentAnalysis.mistakeCount} color={Colors.modes.tactical} />
              <ErrorChip label="Inaccuracies" count={currentAnalysis.inaccuracyCount} color={Colors.glow.violet} />
            </GlassCard>

            {/* Key lesson */}
            {currentAnalysis.keyLesson && (
              <GlassCard glowColor={Colors.border.glow} style={styles.lessonCard}>
                <Text style={styles.lessonTitle}>Key Lesson</Text>
                <Text style={styles.lessonText}>{currentAnalysis.keyLesson}</Text>
              </GlassCard>
            )}

            {/* Progressive move list */}
            {visibleMoves.length > 0 && (
              <View style={styles.moveList}>
                <View style={styles.moveListHeader}>
                  <Text style={styles.sectionTitle}>Move Analysis</Text>
                  <Text style={styles.moveProgress}>{Math.round(progressPercent)}%</Text>
                </View>
                {visibleMoves.slice(-10).map((move) => (
                  <Animated.View
                    key={`${move.moveNumber}-${move.san}`}
                    entering={FadeIn.duration(200)}
                  >
                    <GlassCard style={styles.moveCard}>
                      <View style={styles.moveRow}>
                        <Text style={styles.moveSan}>{move.moveNumber}. {move.san}</Text>
                        <View
                          style={[
                            styles.classificationBadge,
                            { backgroundColor: `${CLASSIFICATION_COLORS[move.classification] || Colors.glow.indigo}20` },
                          ]}
                        >
                          <Text
                            style={[
                              styles.classificationText,
                              { color: CLASSIFICATION_COLORS[move.classification] || Colors.glow.indigo },
                            ]}
                          >
                            {move.classification}
                          </Text>
                        </View>
                        <Text style={styles.evalLoss}>
                          {move.evalLoss > 0 ? `-${move.evalLoss.toFixed(0)}` : '✓'}
                        </Text>
                      </View>
                    </GlassCard>
                  </Animated.View>
                ))}
              </View>
            )}
          </Animated.View>
        )}

        {/* Games list */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Games</Text>

          {gamesLoading ? (
            <View style={{ gap: Spacing.sm }}>
              {[1, 2, 3].map((i) => <Skeleton key={i} height={64} borderRadius={16} />)}
            </View>
          ) : games.length === 0 ? (
            <IntelligentEmptyState type="games" />
          ) : (
            <View style={{ gap: Spacing.sm }}>
              {games.map((game: any) => (
                <TouchableOpacity
                  key={game.id}
                  onPress={() => setSelectedGameId(game.id)}
                  activeOpacity={0.8}
                >
                  <GlassCard
                    style={selectedGameId === game.id ? styles.selectedGame : {}}
                    glowColor={selectedGameId === game.id ? Colors.border.glowCyan : undefined}
                  >
                    <View style={styles.gameRow}>
                      <View
                        style={[
                          styles.resultIndicator,
                          {
                            backgroundColor:
                              game.user_result === 'win'
                                ? Colors.status.win
                                : game.user_result === 'loss'
                                ? Colors.status.loss
                                : Colors.status.draw,
                          },
                        ]}
                      />
                      <View style={styles.gameInfo}>
                        <Text style={styles.gameOpponent}>
                          vs {game.user_color === 'white' ? game.black_username : game.white_username}
                        </Text>
                        <Text style={styles.gameMeta}>
                          {game.time_class} · {game.opening_name || 'Unknown opening'}
                        </Text>
                      </View>
                      <View style={styles.gameRight}>
                        {game.accuracy_score && (
                          <Text style={styles.accuracyText}>{game.accuracy_score}%</Text>
                        )}
                        {game.analysis_status === 'pending' && (
                          <Text style={styles.pendingText}>Pending</Text>
                        )}
                      </View>
                    </View>
                  </GlassCard>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function AccuracyCard({ label, value, color }: { label: string; value?: number; color: string }) {
  return (
    <GlassCard style={styles.accuracyCard}>
      <Text style={[styles.accuracyValue, { color }]}>
        {value ? `${value}%` : '—'}
      </Text>
      <Text style={styles.accuracyLabel}>{label}</Text>
    </GlassCard>
  );
}

function ErrorChip({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <View style={styles.errorChip}>
      <Text style={[styles.errorCount, { color }]}>{count}</Text>
      <Text style={styles.errorLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.void },
  header: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  headerTitle: { ...Typography.title, color: Colors.text.primary },
  headerSubtitle: { ...Typography.caption, color: Colors.text.muted, marginTop: 2 },
  scrollContent: { paddingHorizontal: Spacing.base, paddingTop: Spacing.base },
  section: { marginBottom: Spacing['2xl'] },
  sectionTitle: {
    ...Typography.subheading,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
  },
  accuracyRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  accuracyCard: { flex: 1, alignItems: 'center', paddingVertical: Spacing.md },
  accuracyValue: { fontSize: 16, fontWeight: '700' },
  accuracyLabel: { ...Typography.caption, color: Colors.text.muted, marginTop: 2 },
  errorRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: Spacing.md },
  errorChip: { alignItems: 'center' },
  errorCount: { fontSize: 22, fontWeight: '800' },
  errorLabel: { ...Typography.caption, color: Colors.text.muted },
  lessonCard: { marginBottom: Spacing.md },
  lessonTitle: { ...Typography.label, color: Colors.glow.cyan, marginBottom: Spacing.sm },
  lessonText: { ...Typography.body, color: Colors.text.secondary, lineHeight: 22 },
  moveList: { gap: Spacing.sm },
  moveListHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  moveProgress: { ...Typography.mono, color: Colors.glow.cyan },
  moveCard: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md },
  moveRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  moveSan: { ...Typography.mono, color: Colors.text.primary, flex: 1 },
  classificationBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  classificationText: { fontSize: 11, fontWeight: '600' },
  evalLoss: { ...Typography.mono, color: Colors.text.muted },
  gameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  resultIndicator: { width: 4, height: 40, borderRadius: 2 },
  gameInfo: { flex: 1 },
  gameOpponent: { ...Typography.bodyMedium, color: Colors.text.primary },
  gameMeta: { ...Typography.caption, color: Colors.text.muted, marginTop: 2 },
  gameRight: { alignItems: 'flex-end' },
  accuracyText: { ...Typography.mono, color: Colors.glow.cyan },
  pendingText: { ...Typography.caption, color: Colors.text.muted },
  selectedGame: { borderColor: Colors.border.glowCyan },
});
