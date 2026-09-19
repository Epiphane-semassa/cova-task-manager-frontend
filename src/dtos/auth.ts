export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  username: string;
  password: string;
}

export interface RefreshTokenRequest {
  token: string;
}

export interface AuthTokens {
  token: string;
  refreshToken: string;
  expiryToken: string;
}