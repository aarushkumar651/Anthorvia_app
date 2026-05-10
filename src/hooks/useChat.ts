import { useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { useChatStore } from '@store/chatStore';
import { useUIStore } from '@store/uiStore';
import { chatApi } from '@api/chat';
import { soundService } from '@services/soundService';
import { useHaptics } from './useMicroInteraction';

export function useChat() {
  const {
    messages,
    activeSessionId,
    isGenerating,
    addMessage,
    updateStreamingContent,
    finalizeStreaming,
    setGenerating,
    setActiveSession,
  } = useChatStore();

  const { setAIState } = useUIStore();
  const { confirm } = useHaptics();

  const sendMessage = useCallback(
    async (text: string, gameId: string | null = null) => {
      if (isGenerating || !text.trim()) return;

      const userMsgId = uuid();
      const aiMsgId = uuid();

      addMessage({
        id: userMsgId,
        role: 'user',
        content: text.trim(),
        createdAt: new Date(),
      });

      addMessage({
        id: aiMsgId,
        role: 'assistant',
        content: '',
        isStreaming: true,
        createdAt: new Date(),
      });

      setGenerating(true);
      setAIState('processing');
      await soundService.play('neural_pulse');

      let streamedContent = '';

      await chatApi.streamMessage(
        text,
        activeSessionId,
        gameId,
        (chunk) => {
          streamedContent += chunk;
          updateStreamingContent(streamedContent);
          if (streamedContent.length === 1) {
            setAIState('generating');
          }
        },
        (newSessionId) => {
          setActiveSession(newSessionId);
        },
        () => {
          finalizeStreaming(aiMsgId, streamedContent);
          setAIState('resting');
          confirm();
          soundService.play('analysis_done');
        },
        (error) => {
          finalizeStreaming(aiMsgId, 'Something went wrong. Please try again.');
          setAIState('error');
          setTimeout(() => setAIState('resting'), 2000);
        }
      );
    },
    [isGenerating, activeSessionId, addMessage, updateStreamingContent, finalizeStreaming, setGenerating, setActiveSession, setAIState, confirm]
  );

  return { messages, isGenerating, sendMessage };
}
