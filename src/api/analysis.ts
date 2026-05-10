import { apiClient } from './client';

export const analysisApi = {
  getDashboard: async () => {
    const res = await apiClient.get('/analysis/dashboard');
    return res.data.data;
  },

  getWeaknesses: async () => {
    const res = await apiClient.get('/analysis/weaknesses');
    return res.data.data;
  },

  getOpenings: async (color?: 'white' | 'black') => {
    const res = await apiClient.get('/analysis/openings', {
      params: color ? { color } : {},
    });
    return res.data.data;
  },

  getAccuracyTrend: async (days = 14) => {
    const res = await apiClient.get('/analysis/accuracy-trend', { params: { days } });
    return res.data.data;
  },

  getRatingHistory: async () => {
    const res = await apiClient.get('/analysis/rating-history');
    return res.data.data;
  },
};

export const gamesApi = {
  getGames: async (page = 1, filters?: any) => {
    const res = await apiClient.get('/games', { params: { page, limit: 20, ...filters } });
    return res.data.data;
  },

  getGame: async (gameId: string) => {
    const res = await apiClient.get(`/games/${gameId}`);
    return res.data.data;
  },

  getGameMoves: async (gameId: string) => {
    const res = await apiClient.get(`/games/${gameId}/moves`);
    return res.data.data;
  },

  syncGames: async (platform?: string) => {
    const res = await apiClient.post('/users/sync-games', platform ? { platform } : {});
    return res.data.data;
  },

  getStats: async () => {
    const res = await apiClient.get('/games/stats');
    return res.data.data;
  },
};
