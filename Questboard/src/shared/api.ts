import { apiClient } from "../lib/apiClient";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  provider: string;
  message: string;
}

export type UserProfile = {
  username?: string;
  email?: string;
  membership?: string;
  achievementsCount?: number;
  avatarUrl?: string;
  role?: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
  authType: string;
};

export type SignupCredentials = {
  username: string;
  email: string;
  password: string;
};

export async function loginWithCredentials(credentials: LoginCredentials) {
  return apiClient.post<AuthResponse>("/auth/login", {
    ...credentials,
    role: "USER",
  });
}

export async function registerWithCredentials(credentials: SignupCredentials) {
  return apiClient.post<AuthResponse>("/auth/register", {
    ...credentials,
    role: "USER",
  });
}

export async function refreshTokens(refreshToken: string) {
  return apiClient.post<AuthResponse>("/auth/refresh", {
    refreshToken,
  });
}

export async function fetchUserProfile() {
  return apiClient.get<UserProfile>("/auth/me");
}
