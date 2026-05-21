let accessToken: string | null = null;

const REFRESH_TOKEN_KEY = "questboard_refresh_token";

export const tokenStorage = {
  setTokens(access: string, refresh: string) {
    accessToken = access;
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  },

  getAccessToken(): string | null {
    return accessToken;
  },

  getRefreshToken(): string | null {
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setAccessToken(access: string) {
    accessToken = access;
  },

  clearTokens() {
    accessToken = null;
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  hasRefreshToken(): boolean {
    return window.localStorage.getItem(REFRESH_TOKEN_KEY) !== null;
  },
};