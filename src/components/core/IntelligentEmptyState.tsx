import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  FadeIn,
} from 'react-native-reanimated';
import { Colors, Typography, Spacing } from '@theme/index';

interface EmptyStateConfig {
  title: string;
  subtitle: string;
}

const EMPTY_STATES: Record<string, EmptyStateConfig> = {
  chat: {
    title: 'Your AI Coach is Ready',
    subtitle: 'Ask anything about your chess game.',
  },
  dashboard: {
    title: 'Intelligence Awaits',
    subtitle: 'Connect your Chess.com or Lichess account to begin.',
  },
  analysis: {
    title: 'No Battles Analyzed Yet',
    subtitle: 'Every game is a lesson Anthorvia hasn\'t read.',
  },
  games: {
    title: 'Your Game History',
    subtitle: 'Sync your account to import your games.',
  },
  weaknesses: {
    title: 'Pattern Library Empty',
    subtitle: 'Play games and Anthorvia will find what others miss.',
  },
};

const CHAT_SUGGESTIONS = [
  'Why do I blunder in time pressure?',
  'Analyze my latest rapid game.',
  'What is my biggest weakness?',
  'Train my Sicilian defense.',
  'How can I improve my endgame?',
  'Explain my opening inaccuracies.',
];

interface Props {
  type: keyof typeof EMPTY_STATES;
  showSuggestions?: boolean;
  onSuggestionPress?: (text: string) => void;
}

export function IntelligentEmptyState({ type, showSuggestions, onSuggestionPress }: Props) {
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const textOpacity = useSharedValue(1);
  const orbScale = useSharedValue(1);

  const state = EMPTY_STATES[type] || EMPTY_STATES.chat;

  useEffect(() => {
    orbScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000 }),
        withTiming(1.0, { duration: 2000 })
      ),
      -1,
      false
    );

    if (showSuggestions) {
      const interval = setInterval(() => {
        textOpacity.value = withTiming(0, { duration: 300 });
        setTimeout(() => {
          setSuggestionIndex((i) => (i + 1) % CHAT_SUGGESTIONS.length);
          textOpacity.value = withTiming(1, { duration: 300 });
        }, 300);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [showSuggestions]);

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: orbScale.value }],
  }));

  const suggestionStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <Animated.View entering={FadeIn.duration(600)} style={styles.container}>
      <Animated.View style={[styles.orb, orbStyle]} />

      <Text style={styles.title}>{state.title}</Text>
      <Text style={styles.subtitle}>{state.subtitle}</Text>

      {showSuggestions && (
        <Animated.Text
          style={[styles.suggestion, suggestionStyle]}
          onPress={() => onSuggestionPress?.(CHAT_SUGGESTIONS[suggestionIndex])}
        >
          "{CHAT_SUGGESTIONS[suggestionIndex]}"
        </Animated.Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing['3xl'],
    gap: Spacing.md,
  },
  orb: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border.glow,
    shadowColor: Colors.glow.indigo,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.heading,
    textAlign: 'center',
    color: Colors.text.primary,
  },
  subtitle: {
    ...Typography.body,
    textAlign: 'center',
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  suggestion: {
    ...Typography.bodyMedium,
    color: Colors.glow.cyan,
    textAlign: 'center',
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.glowCyan,
    borderRadius: 999,
  },
});
