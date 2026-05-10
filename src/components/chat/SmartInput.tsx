import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Keyboard,
  Animated as RNAnimated,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { Colors, Typography, BorderRadius, Spacing } from '@theme/index';
import { Springs } from '@animations/springs';
import { useAIMode } from '@hooks/useAIMode';
import { useHaptics } from '@hooks/useMicroInteraction';
import { Config } from '@constants/config';

const PLACEHOLDERS = [
  'Ask your chess coach anything...',
  'Why do I blunder in time pressure?',
  'Analyze my latest rapid game...',
  'What is my biggest weakness?',
  'Train my Sicilian defense...',
  'How can I improve my endgame?',
];

interface SmartInputProps {
  onSend: (text: string) => void;
  onModePress: () => void;
  disabled?: boolean;
}

export function SmartInput({ onSend, onModePress, disabled }: SmartInputProps) {
  const [text, setText] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const { mode } = useAIMode();
  const { lightTap } = useHaptics();

  const borderGlow = useSharedValue(0);
  const sendScale = useSharedValue(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isFocused && !text) {
        setPlaceholderIndex((i) => (i + 1) % PLACEHOLDERS.length);
      }
    }, Config.PLACEHOLDER_CYCLE_MS);
    return () => clearInterval(interval);
  }, [isFocused, text]);

  useEffect(() => {
    sendScale.value = withSpring(text.trim().length > 0 ? 1 : 0, Springs.SNAPPY);
  }, [text]);

  const handleFocus = () => {
    setIsFocused(true);
    borderGlow.value = withTiming(1, { duration: 200 });
  };

  const handleBlur = () => {
    setIsFocused(false);
    borderGlow.value = withTiming(0, { duration: 200 });
  };

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    lightTap();
    onSend(trimmed);
    setText('');
    Keyboard.dismiss();
  }, [text, disabled, lightTap, onSend]);

  const containerStyle = useAnimatedStyle(() => ({
    borderColor: borderGlow.value === 1
      ? Colors.border.glowCyan
      : Colors.border.subtle,
    shadowOpacity: borderGlow.value * 0.3,
  }));

  const sendStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sendScale.value }],
    opacity: sendScale.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Mode pill */}
      <TouchableOpacity
        style={[styles.modePill, { borderColor: mode.glowColor }]}
        onPress={onModePress}
        activeOpacity={0.7}
      >
        <Text style={[styles.modeLabel, { color: mode.color }]}>
          {mode.label}
        </Text>
      </TouchableOpacity>

      {/* Text input */}
      <TextInput
        ref={inputRef}
        value={text}
        onChangeText={setText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={PLACEHOLDERS[placeholderIndex]}
        placeholderTextColor={Colors.text.muted}
        multiline
        maxLength={Config.MAX_MESSAGE_LENGTH}
        style={styles.input}
        onSubmitEditing={handleSend}
        blurOnSubmit={false}
        editable={!disabled}
      />

      {/* Send button */}
      <Animated.View style={sendStyle}>
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          disabled={disabled || !text.trim()}
          activeOpacity={0.8}
        >
          <Text style={styles.sendIcon}>↑</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.background.elevated,
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    shadowColor: Colors.glow.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 16,
    elevation: 4,
  },
  modePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
    borderWidth: 1,
    marginBottom: 4,
  },
  modeLabel: {
    ...Typography.caption,
    fontWeight: '600',
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.text.primary,
    maxHeight: 120,
    paddingVertical: 4,
    paddingTop: 4,
  },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.glow.indigo,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.glow.indigo,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 6,
  },
  sendIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
