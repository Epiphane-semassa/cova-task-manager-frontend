const ACCESS_TOKEN_KEY = 'task_manager_access_token';
const REFRESH_TOKEN_KEY = 'task_manager_refresh_token';
const EXPIRY_TOKEN_KEY = 'task_manager_expiry_token';

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  expiryToken: string;
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getExpiryToken(): string | null {
  return localStorage.getItem(EXPIRY_TOKEN_KEY);
}

export function getStoredTokens(): StoredTokens | null {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  const expiryToken = getExpiryToken();
  if (!accessToken || !refreshToken) {
    return null;
  }
  return { accessToken, refreshToken, expiryToken: expiryToken ?? '' };
}

export function saveTokens(tokens: StoredTokens): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  localStorage.setItem(EXPIRY_TOKEN_KEY, tokens.expiryToken);
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(EXPIRY_TOKEN_KEY);
}

export function isAccessTokenValid(): boolean {
  const accessToken = getAccessToken();
  const expiryToken = getExpiryToken();
  if (!accessToken || !expiryToken) {
    return false;
  }
  const expiry = Date.parse(expiryToken);
  if (Number.isNaN(expiry)) {
    return false;
  }
  return expiry > Date.now();
}