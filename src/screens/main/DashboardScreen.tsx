import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useQuery } from '@tanstack/react-query';
import { LivingBackground } from '@components/core/LivingBackground';
import { GlassCard } from '@components/core/GlassCard';
import { AntherviaLogo } from '@components/core/AntherviaLogo';
import { IntelligentEmptyState } from '@components/core/IntelligentEmptyState';
import { Skeleton, SkeletonCard } from '@components/core/Skeleton';
import { Colors, Typography, Spacing, BorderRadius, Layout } from '@theme/index';
import { analysisApi } from '@api/analysis';
import { useAuthStore } from '@store/authStore';

const WEAKNESS_COLORS: Record<string, string> = {
  tactical: Colors.status.loss,
  positional: Colors.glow.violet,
  opening: Colors.glow.blue,
  endgame: Colors.modes.endgame,
  time_management: Colors.modes.tactical,
};

export function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();

  const {
    data: dashboard,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['dashboard'],
    queryFn: analysisApi.getDashboard,
    staleTime: 1000 * 60 * 5,
  });

  const weeklyStats = dashboard?.weekly;
  const topWeaknesses = dashboard?.top_weaknesses || [];
  const recentGames = dashboard?.recent_games || [];
  const accuracyTrend = dashboard?.accuracy_trend || [];

  const getHour = () => {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LivingBackground />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Layout.tabBarHeight + Spacing['3xl'] },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={Colors.glow.cyan}
          />
        }
      >
        {/* Header */}
        <Animated.View entering={FadeIn.duration(500)} style={styles.header}>
          <AntherviaLogo size={40} />
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Good {getHour()},</Text>
            <Text style={styles.name}>{user?.name?.split(' ')[0] || 'Player'}</Text>
          </View>
        </Animated.View>

        {/* Stats row */}
        {isLoading ? (
          <View style={styles.statsRow}>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={styles.statCardWrapper}>
                <SkeletonCard />
              </View>
            ))}
          </View>
        ) : weeklyStats ? (
          <View style={styles.statsRow}>
            <StatCard label="Games" value={weeklyStats.games || 0} />
            <StatCard label="Win Rate" value={`${weeklyStats.win_rate || 0}%`} color={Colors.status.win} />
            <StatCard label="Accuracy" value={`${weeklyStats.avg_accuracy || 0}%`} color={Colors.glow.cyan} />
            <StatCard label="Blunders" value={(weeklyStats.avg_blunders || 0).toFixed(1)} color={Colors.status.loss} />
          </View>
        ) : (
          <IntelligentEmptyState type="dashboard" />
        )}

        {/* Top Weaknesses */}
        {topWeaknesses.length > 0 && (
          <Animated.View entering={FadeIn.delay(200).duration(500)} style={styles.section}>
            <Text style={styles.sectionTitle}>Top Weaknesses</Text>
            <GlassCard noPadding>
              {topWeaknesses.map((w: any, i: number) => (
                <View
                  key={i}
                  style={[
                    styles.weaknessRow,
                    i < topWeaknesses.length - 1 && styles.weaknessDivider,
                  ]}
                >
                  <View
                    style={[
                      styles.severityDot,
                      {
                        backgroundColor:
                          WEAKNESS_COLORS[w.category] || Colors.glow.violet,
                      },
                    ]}
                  />
                  <View style={styles.weaknessInfo}>
                    <Text style={styles.weaknessName}>
                      {w.subcategory?.replace(/_/g, ' ') || w.category}
                    </Text>
                    <Text style={styles.weaknessMeta}>
                      Severity {w.severity}/5 · {w.occurrence_count} games
                    </Text>
                  </View>
                  <View style={styles.severityBar}>
                    {[1, 2, 3, 4, 5].map((dot) => (
                      <View
                        key={dot}
                        style={[
                          styles.severityBarDot,
                          dot <= w.severity && {
                            backgroundColor:
                              WEAKNESS_COLORS[w.category] || Colors.glow.violet,
                          },
                        ]}
                      />
                    ))}
                  </View>
                </View>
              ))}
            </GlassCard>
          </Animated.View>
        )}

        {/* Recent Games */}
        {recentGames.length > 0 && (
          <Animated.View entering={FadeIn.delay(300).duration(500)} style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Battles</Text>
            <View style={styles.gamesList}>
              {recentGames.map((game: any) => (
                <GlassCard key={game.id} style={styles.gameCard}>
                  <View style={styles.gameRow}>
                    <View
                      style={[
                        styles.resultDot,
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
                        vs{' '}
                        {game.user_color === 'white'
                          ? game.black_username
                          : game.white_username}
                      </Text>
                      <Text style={styles.gameMeta}>
                        {game.time_class} · {game.user_rating}
                      </Text>
                    </View>
                    {game.accuracy_score && (
                      <Text style={styles.gameAccuracy}>
                        {game.accuracy_score}%
                      </Text>
                    )}
                  </View>
                </GlassCard>
              ))}
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

function StatCard({ label, value, color }: { label: string; value: any; color?: string }) {
  return (
    <GlassCard style={styles.statCard}>
      <Text style={[styles.statValue, color ? { color } : {}]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.void },
  scrollContent: { paddingHorizontal: Spacing.base, paddingTop: Spacing.base },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing['2xl'],
    paddingTop: Spacing.base,
  },
  headerText: { flex: 1 },
  greeting: { ...Typography.caption, color: Colors.text.muted },
  name: { ...Typography.title, color: Colors.text.primary },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing['2xl'],
  },
  statCardWrapper: { flex: 1 },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: Spacing.md },
  statValue: {
    ...Typography.heading,
    color: Colors.text.primary,
    fontSize: 20,
  },
  statLabel: { ...Typography.caption, color: Colors.text.muted, marginTop: 2 },
  section: { marginBottom: Spacing['2xl'] },
  sectionTitle: {
    ...Typography.subheading,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
    letterSpacing: 0.5,
  },
  weaknessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    gap: Spacing.md,
  },
  weaknessDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  weaknessInfo: { flex: 1 },
  weaknessName: {
    ...Typography.bodyMedium,
    color: Colors.text.primary,
    textTransform: 'capitalize',
  },
  weaknessMeta: { ...Typography.caption, color: Colors.text.muted, marginTop: 2 },
  severityBar: { flexDirection: 'row', gap: 3 },
  severityBarDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.background.elevated,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  gamesList: { gap: Spacing.sm },
  gameCard: {},
  gameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  resultDot: { width: 8, height: 8, borderRadius: 4 },
  gameInfo: { flex: 1 },
  gameOpponent: { ...Typography.bodyMedium, color: Colors.text.primary },
  gameMeta: { ...Typography.caption, color: Colors.text.muted, marginTop: 2 },
  gameAccuracy: { ...Typography.mono, color: Colors.glow.cyan },
});
