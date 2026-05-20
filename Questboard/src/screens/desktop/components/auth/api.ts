import { apiClient } from "lib/apiClient";

export type LoginCredentials = {
  email: string;
  password: string;
  authType?: string;
};

export type SignupCredentials = {
  username: string;
  email: string;
  password: string;
  authType?: string;
};

/**
 * Backend auth response structure
 * User data can be extracted from JWT tokens
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  provider: string;
  message: string;
}

/**
 * Login with email and password
 * Returns tokens and basic user info
 */
export async function loginWithCredentials(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>("/auth/login", {
    ...credentials,
    role: "USER",
  });
}

/**
 * Register with email, password, and username
 * Returns tokens and basic user info
 */
export async function registerWithCredentials(
  credentials: SignupCredentials
): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>("/auth/register", {
    ...credentials,
    role: "USER",
  });
}

/**
 * Login with Google OAuth token
 * Returns tokens and basic user info
 */
export async function loginWithGoogle(googleToken: string): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>("/auth/google/login", {
    token: googleToken,
  });
}
