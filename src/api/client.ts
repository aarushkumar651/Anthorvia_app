import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { Config } from '@constants/config';
import { useAuthStore } from '@store/authStore';

export const apiClient = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'X-Platform': 'android',
    'X-App-Version': '1.0.0',
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const refreshToken = useAuthStore.getState().refreshToken;
      if (refreshToken) {
        try {
          const res = await axios.post(`${Config.API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });
          const { tokens } = res.data.data;
          const user = useAuthStore.getState().user!;
          useAuthStore.getState().setAuth(user, tokens);

          if (error.config) {
            error.config.headers.Authorization = `Bearer ${tokens.accessToken}`;
            return apiClient.request(error.config);
          }
        } catch {
          useAuthStore.getState().logout();
        }
      } else {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);
