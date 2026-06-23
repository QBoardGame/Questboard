import { apiClient } from '../lib/apiClient';
import { tokenStorage } from '../lib/tokenStorage';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  provider: string;
  message: string;
}

export type userWallet = {
  cashBalance: number;
  coinBalance: number;
  lockedCashBalance: number;
  lockedCoinBalance: number;
  totalCashEarned: number;
  totalCoinsEarned: number;
};

export type UserProfile = {
  username?: string;
  email?: string;
  membership?: string;
  achievementsCount?: number;
  avatarUrl?: string;
  role?: string;
  wallet?: userWallet;
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
  authType: string;
};

export async function loginWithCredentials(credentials: LoginCredentials) {
  return apiClient.post<AuthResponse>('/auth/login', {
    ...credentials,
    role: 'USER',
  });
}

export async function logout() {
  try {
    await apiClient.post('/auth/logout');
  } finally {
    // Clear local tokens even if the API call fails
    tokenStorage.clearTokens();
  }
}

export async function registerWithCredentials(credentials: SignupCredentials) {
  return apiClient.post<AuthResponse>('/auth/register', {
    ...credentials,
    role: 'USER',
  });
}

export async function refreshTokens(refreshToken: string) {
  return apiClient.post<AuthResponse>('/auth/refresh', {
    refreshToken,
  });
}

export async function fetchUserProfile(): Promise<UserProfile> {
  const response = await apiClient.get<any>('/auth/me');

  if (!response || (!response.username && !response.name && !response.email)) {
    throw new Error('Invalid profile response from auth/me');
  }

  const profile: UserProfile = {
    username: response?.username ?? response?.name,
    email: response?.email,
    membership: response?.membership ?? response?.plan,
    achievementsCount:
      typeof response?.achievements === 'number'
        ? response.achievements
        : Array.isArray(response?.achievements)
        ? response.achievements.length
        : undefined,
    avatarUrl: response?.avatarUrl ?? response?.avatar,
    role:
      response?.role ?? response?.userRole
        ? String(response.role ?? response.userRole).toUpperCase()
        : undefined,
  };

  if (response?.wallet) {
    profile.wallet = {
      cashBalance: response.wallet.cashBalance,
      coinBalance: response.wallet.coinBalance,
      lockedCashBalance: response.wallet.lockedCashBalance,
      lockedCoinBalance: response.wallet.lockedCoinBalance,
      totalCashEarned: response.wallet.totalCashEarned,
      totalCoinsEarned: response.wallet.totalCoinsEarned,
    };
  }

  return Object.fromEntries(
    Object.entries(profile).filter(([, value]) => value !== undefined),
  ) as UserProfile;
}
