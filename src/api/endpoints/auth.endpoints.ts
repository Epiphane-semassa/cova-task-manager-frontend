import type { AuthTokens, LoginRequest, RefreshTokenRequest, RegisterRequest } from '../../dtos/auth';
import type { User } from '../../../src/models/user';
import type { ApiEnvelope } from '../../types/envelope';
import { getUserInfo, login, logout, refreshToken, register } from '../sdk.gen';

type EnvelopeWithData<T> = ApiEnvelope<T>;

export async function apiLogin(request: LoginRequest): Promise<AuthTokens> {
  const { data } = await login({
    body: request,
    throwOnError: true,
  });
  const envelope = data as unknown as EnvelopeWithData<AuthTokens>;
  return envelope.data;
}

export async function apiRegister(request: RegisterRequest): Promise<void> {
  await register({
    body: request,
    throwOnError: true,
  });
}

export async function apiRefreshToken(refreshTokenValue: string): Promise<AuthTokens> {
  const { data } = await refreshToken({
    body: { token: refreshTokenValue } satisfies RefreshTokenRequest,
    throwOnError: true,
  });
  const envelope = data as unknown as EnvelopeWithData<AuthTokens>;
  return envelope.data;
}

export async function apiLogout(refreshTokenValue: string): Promise<void> {
  await logout({
    body: { token: refreshTokenValue } satisfies RefreshTokenRequest,
    throwOnError: true,
  });
}

export async function apiGetUserInfo(): Promise<User> {
  const { data } = await getUserInfo({
    throwOnError: true,
  });
  const envelope = data as unknown as EnvelopeWithData<User>;
  return envelope.data;
}