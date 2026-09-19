import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apiGetUserInfo, apiLogin, apiLogout, apiRegister } from '../../../api/endpoints';
import type { LoginRequest, RegisterRequest } from '../../../dtos/auth';
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from '../../../lib/token-storage';
import type { User } from '../../../models/user';
import { AuthContext, type AuthContextValue } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(() => getAccessToken() !== null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      return;
    }
    let cancelled = false;
    apiGetUserInfo()
      .then((currentUser) => {
        if (!cancelled) {
          setUser(currentUser);
        }
      })
      .catch(() => {
        if (cancelled) {
          return;
        }
        clearTokens();
        setUser(null);
      })
      .finally(() => {
        if (!cancelled) {
          setIsInitializing(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const loadUser = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      return;
    }
    const currentUser = await apiGetUserInfo();
    setUser(currentUser);
  }, []);

  const login = useCallback(
    async (request: LoginRequest) => {
      const tokens = await apiLogin(request);
      saveTokens({
        accessToken: tokens.token,
        refreshToken: tokens.refreshToken,
        expiryToken: tokens.expiryToken,
      });
      queryClient.clear();
      await loadUser();
    },
    [loadUser, queryClient],
  );

  const register = useCallback(async (request: RegisterRequest) => {
    await apiRegister(request);
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) {
        await apiLogout(refreshToken);
      }
    } finally {
      clearTokens();
      setUser(null);
      queryClient.clear();
    }
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isInitializing,
      login,
      register,
      logout,
    }),
    [user, isInitializing, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}