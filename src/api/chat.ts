import { apiClient } from './client';
import { Config } from '@constants/config';
import { useAuthStore } from '@store/authStore';

export const chatApi = {
  getSessions: async (page = 1) => {
    const res = await apiClient.get('/chat/sessions', { params: { page, limit: 20 } });
    return res.data.data;
  },

  getMessages: async (sessionId: string, page = 1) => {
    const res = await apiClient.get(`/chat/sessions/${sessionId}/messages`, {
      params: { page, limit: 30 },
    });
    return res.data.data;
  },

  deleteSession: async (sessionId: string) => {
    await apiClient.delete(`/chat/sessions/${sessionId}`);
  },

  streamMessage: async (
    message: string,
    sessionId: string | null,
    gameId: string | null,
    onChunk: (text: string) => void,
    onSessionId: (id: string) => void,
    onDone: () => void,
    onError: (error: string) => void
  ) => {
    const token = useAuthStore.getState().accessToken;

    const response = await fetch(`${Config.API_BASE_URL}/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message,
        session_id: sessionId,
        game_id: gameId,
      }),
    });

    if (!response.ok) {
      onError('Failed to connect to AI coach');
      return;
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      onError('No response stream');
      return;
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (!data || data === '[DONE]') continue;

        try {
          const parsed = JSON.parse(data);
          if (parsed.type === 'chunk' && parsed.text) {
            onChunk(parsed.text);
          } else if (parsed.type === 'done' && parsed.session_id) {
            onSessionId(parsed.session_id);
            onDone();
          } else if (parsed.type === 'error') {
            onError(parsed.message);
          }
        } catch {}
      }
    }
  },
};
