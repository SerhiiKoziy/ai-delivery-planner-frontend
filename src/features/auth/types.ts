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

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export type UserRole = 'user' | 'admin';

export interface CurrentUser {
  id: string;
  email: string;
  organizationId: string;
  role: UserRole;
  isVerified: boolean;
}

export interface RegisterResult {
  userId: string;
  email: string;
  message: string;
}
