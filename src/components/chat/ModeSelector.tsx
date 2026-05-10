import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  FadeIn,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import { Colors, Typography, BorderRadius, Spacing } from '@theme/index';
import { AI_MODE_LIST, AIModeId } from '@constants/aiModes';
import { useAIMode } from '@hooks/useAIMode';

interface ModeSelectorProps {
  onClose: () => void;
}

export function ModeSelector({ onClose }: ModeSelectorProps) {
  const { currentMode, switchMode } = useAIMode();

  const handleSelect = async (modeId: AIModeId) => {
    await switchMode(modeId);
    onClose();
  };

  return (
    <Animated.View
      entering={SlideInDown.springify().damping(24).stiffness(200)}
      exiting={SlideOutDown.duration(200)}
      style={styles.container}
    >
      <View style={styles.handle} />
      <Text style={styles.title}>AI Mode</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.modeList}
      >
        {AI_MODE_LIST.map((mode) => {
          const isActive = mode.id === currentMode;
          return (
            <TouchableOpacity
              key={mode.id}
              style={[
                styles.modeCard,
                isActive && { borderColor: mode.color, backgroundColor: `${mode.color}12` },
              ]}
              onPress={() => handleSelect(mode.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.modeLabel, { color: isActive ? mode.color : Colors.text.primary }]}>
                {mode.label}
              </Text>
              <Text style={styles.modeSubtitle}>{mode.subtitle}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background.elevated,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    paddingTop: Spacing.md,
    paddingBottom: Spacing['3xl'],
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border.default,
    alignSelf: 'center',
    marginBottom: Spacing.base,
  },
  title: {
    ...Typography.heading,
    color: Colors.text.primary,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.base,
  },
  modeList: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  modeCard: {
    backgroundColor: Colors.background.card,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    minWidth: 120,
    gap: 4,
  },
  modeLabel: {
    ...Typography.bodyMedium,
    color: Colors.text.primary,
  },
  modeSubtitle: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
});
