import { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { AuthTokens } from '../../dtos/auth';
import { clearTokens, getRefreshToken, saveTokens } from '../../lib/token-storage';
import { client } from '../client.gen';
import { apiRefreshToken } from '../endpoints/auth.endpoints';

const PUBLIC_PATHS = ['/api/auth/login', '/api/auth/register', '/api/auth/refresh-token'];

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<AuthTokens> | null = null;

function performRefresh(): Promise<AuthTokens> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return Promise.reject(new Error('Aucun refresh token disponible'));
  }
  if (!refreshPromise) {
    refreshPromise = apiRefreshToken(refreshToken)
      .then((tokens) => {
        saveTokens({
          accessToken: tokens.token,
          refreshToken: tokens.refreshToken,
          expiryToken: tokens.expiryToken,
        });
        return tokens;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

export function setupRefreshInterceptor(): void {
  client.instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const config = error.config as RetriableConfig | undefined;
      const url = config?.url ?? '';

      if (!config || error.response?.status !== 401 || config._retry) {
        return Promise.reject(error);
      }
      if (PUBLIC_PATHS.some((path) => url.includes(path))) {
        return Promise.reject(error);
      }

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        window.location.assign('/login');
        return Promise.reject(error);
      }

      config._retry = true;
      try {
        const tokens = await performRefresh();
        config.headers.Authorization = `Bearer ${tokens.token}`;
        return client.instance(config);
      } catch (refreshError) {
        clearTokens();
        window.location.assign('/login');
        return Promise.reject(refreshError instanceof AxiosError ? refreshError : error);
      }
    },
  );
}