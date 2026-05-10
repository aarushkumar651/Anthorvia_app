import { apiClient } from './client';

export const authApi = {
  register: async (email: string, password: string, name: string) => {
    const res = await apiClient.post('/auth/register', { email, password, name });
    return res.data.data;
  },

  login: async (email: string, password: string) => {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data.data;
  },

  refresh: async (refreshToken: string) => {
    const res = await apiClient.post('/auth/refresh', { refresh_token: refreshToken });
    return res.data.data;
  },

  logout: async (refreshToken: string) => {
    await apiClient.post('/auth/logout', { refresh_token: refreshToken });
  },

  getMe: async () => {
    const res = await apiClient.get('/users/me');
    return res.data.data;
  },

  connectPlatform: async (platform: 'chess.com' | 'lichess', username: string) => {
    const res = await apiClient.post('/users/connect-platform', { platform, username });
    return res.data.data;
  },

  completeOnboarding: async () => {
    await apiClient.post('/users/onboarding/complete');
  },

  updateProfile: async (updates: {
    name?: string;
    coach_personality?: string;
    preferred_platform?: string;
  }) => {
    const res = await apiClient.patch('/users/me', updates);
    return res.data.data;
  },
};
