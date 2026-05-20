/**
 * Token Storage Manager
 * - accessToken: stored in memory (cleared on page refresh)
 * - refreshToken: stored in localStorage (persistent secure storage)
 */

let accessToken: string | null = null;

const REFRESH_TOKEN_KEY = "questboard_refresh_token";

export const tokenStorage = {
  /**
   * Set both access and refresh tokens
   */
  setTokens(access: string, refresh: string) {
    accessToken = access;
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  },

  /**
   * Get the current access token from memory
   */
  getAccessToken(): string | null {
    return accessToken;
  },

  /**
   * Get the refresh token from secure storage
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Clear both tokens (on logout)
   */
  clearTokens() {
    accessToken = null;
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Update access token only (after refresh)
   */
  setAccessToken(access: string) {
    accessToken = access;
  },

  /**
   * Check if tokens exist
   */
  hasTokens(): boolean {
    return accessToken !== null || this.getRefreshToken() !== null;
  },
};
