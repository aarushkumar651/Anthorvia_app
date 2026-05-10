import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { FadeIn, SlideInLeft, SlideInRight } from 'react-native-reanimated';
import { StreamingText } from './StreamingText';
import { Colors, Typography, BorderRadius, Spacing } from '@theme/index';
import type { ChatMessage } from '@store/chatStore';

interface ChatBubbleProps {
  message: ChatMessage;
  isLast: boolean;
}

export function ChatBubble({ message, isLast }: ChatBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <Animated.View
      entering={isUser ? SlideInRight.duration(250) : SlideInLeft.duration(250)}
      style={[styles.wrapper, isUser ? styles.userWrapper : styles.aiWrapper]}
    >
      {!isUser && (
        <View style={styles.aiIndicator} />
      )}

      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.aiBubble,
        ]}
      >
        {isUser ? (
          <Text style={styles.userText}>{message.content}</Text>
        ) : (
          <StreamingText
            content={message.content}
            isStreaming={message.isStreaming === true}
          />
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xs,
    maxWidth: '92%',
  },
  userWrapper: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  aiWrapper: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  aiIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.glow.indigo,
    marginTop: 16,
    shadowColor: Colors.glow.indigo,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  bubble: {
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    maxWidth: '100%',
  },
  userBubble: {
    backgroundColor: Colors.glow.indigo,
    borderBottomRightRadius: BorderRadius.sm,
  },
  aiBubble: {
    backgroundColor: Colors.background.elevated,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    borderBottomLeftRadius: BorderRadius.sm,
  },
  userText: {
    ...Typography.body,
    color: '#FFFFFF',
    lineHeight: 22,
  },
});
