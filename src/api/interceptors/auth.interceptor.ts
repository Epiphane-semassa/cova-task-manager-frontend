import type { InternalAxiosRequestConfig } from 'axios';
import { getAccessToken } from '../../lib/token-storage';

export function authRequestInterceptor(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}