export interface AuthCredentials {
  email: string;
  password: string;
}

export type LoginRequest = AuthCredentials;
export type RegisterRequest = AuthCredentials;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export interface RegisterResult {
  userId: string;
  email: string;
  message: string;
}
