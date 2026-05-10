import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({ id: 'anthorvia-auth' });

interface User {
  id: string;
  email: string;
  name: string;
  chess_com_username: string | null;
  lichess_username: string | null;
  coach_personality: string;
  onboarding_complete: boolean;
  plan: string;
  subscriptionStatus: string;
  isActive: boolean;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (user: User, tokens: { accessToken: string; refreshToken: string }) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user, tokens) => {
    storage.set('access_token', tokens.accessToken);
    storage.set('refresh_token', tokens.refreshToken);
    storage.set('user', JSON.stringify(user));
    set({
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  updateUser: (updates) => {
    const current = get().user;
    if (!current) return;
    const updated = { ...current, ...updates };
    storage.set('user', JSON.stringify(updated));
    set({ user: updated });
  },

  logout: () => {
    storage.clearAll();
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  loadFromStorage: () => {
    try {
      const token = storage.getString('access_token');
      const refresh = storage.getString('refresh_token');
      const userStr = storage.getString('user');

      if (token && userStr) {
        const user = JSON.parse(userStr);
        set({
          user,
          accessToken: token,
          refreshToken: refresh || null,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },
}));
