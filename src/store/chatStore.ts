import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  createdAt: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: Date;
}

interface ChatState {
  sessions: ChatSession[];
  activeSessionId: string | null;
  messages: ChatMessage[];
  isGenerating: boolean;
  streamingContent: string;

  setActiveSession: (id: string | null) => void;
  setSessions: (sessions: ChatSession[]) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  updateStreamingContent: (content: string) => void;
  finalizeStreaming: (messageId: string, content: string) => void;
  setGenerating: (generating: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  sessions: [],
  activeSessionId: null,
  messages: [],
  isGenerating: false,
  streamingContent: '',

  setActiveSession: (id) => set({ activeSessionId: id }),
  setSessions: (sessions) => set({ sessions }),
  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  updateStreamingContent: (content) =>
    set((state) => {
      const msgs = state.messages.map((m) =>
        m.isStreaming ? { ...m, content } : m
      );
      return { messages: msgs, streamingContent: content };
    }),

  finalizeStreaming: (messageId, content) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === messageId ? { ...m, content, isStreaming: false } : m
      ),
      isGenerating: false,
      streamingContent: '',
    })),

  setGenerating: (isGenerating) => set({ isGenerating }),
  clearMessages: () => set({ messages: [], activeSessionId: null }),
}));
