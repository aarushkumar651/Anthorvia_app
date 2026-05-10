import React, { useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LivingBackground } from '@components/core/LivingBackground';
import { AntherviaLogo } from '@components/core/AntherviaLogo';
import { AIOrb } from '@components/core/AIOrb';
import { ChatBubble } from '@components/chat/ChatBubble';
import { AIThinkingIndicator } from '@components/chat/AIThinkingEngine';
import { SmartInput } from '@components/chat/SmartInput';
import { ModeSelector } from '@components/chat/ModeSelector';
import { IntelligentEmptyState } from '@components/core/IntelligentEmptyState';
import { Colors, Typography, Spacing, Layout } from '@theme/index';
import { useChat } from '@hooks/useChat';
import { useUIStore } from '@store/uiStore';
import type { ChatMessage } from '@store/chatStore';

export function ChatScreen() {
  const insets = useSafeAreaInsets();
  const [showModeSelector, setShowModeSelector] = useState(false);
  const listRef = useRef<FlashList<ChatMessage>>(null);
  const { messages, isGenerating, sendMessage } = useChat();
  const { aiState } = useUIStore();

  const handleSend = useCallback(
    (text: string) => {
      sendMessage(text);
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 100);
    },
    [sendMessage]
  );

  const handleSuggestion = useCallback(
    (text: string) => {
      handleSend(text);
    },
    [handleSend]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: ChatMessage; index: number }) => (
      <ChatBubble message={item} isLast={index === messages.length - 1} />
    ),
    [messages.length]
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LivingBackground />

      {/* Header */}
      <View style={styles.header}>
        <AntherviaLogo size={36} />
        <Text style={styles.headerTitle}>Anthorvia</Text>
        <AIOrb size={32} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Message list */}
        {messages.length === 0 ? (
          <View style={styles.flex}>
            <IntelligentEmptyState
              type="chat"
              showSuggestions
              onSuggestionPress={handleSuggestion}
            />
          </View>
        ) : (
          <FlashList
            ref={listRef}
            data={messages}
            renderItem={renderItem}
            estimatedItemSize={80}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageList}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
            ListFooterComponent={
              isGenerating && messages[messages.length - 1]?.role === 'user' ? (
                <AIThinkingIndicator />
              ) : null
            }
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Input bar */}
        <View
          style={[
            styles.inputContainer,
            { paddingBottom: Math.max(insets.bottom, Spacing.base) + Layout.tabBarHeight + Spacing.sm },
          ]}
        >
          <SmartInput
            onSend={handleSend}
            onModePress={() => setShowModeSelector(true)}
            disabled={isGenerating}
          />
        </View>
      </KeyboardAvoidingView>

      {/* Mode selector sheet */}
      {showModeSelector && (
        <ModeSelector onClose={() => setShowModeSelector(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.void },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  headerTitle: {
    ...Typography.heading,
    color: Colors.text.primary,
    letterSpacing: 2,
  },
  messageList: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  inputContainer: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border.subtle,
    backgroundColor: Colors.background.void,
  },
});
