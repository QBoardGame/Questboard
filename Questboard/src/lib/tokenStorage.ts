// let accessToken: string | null = null;

// const REFRESH_TOKEN_KEY = "questboard_refresh_token";

// export const tokenStorage = {
//   setTokens(access: string, refresh: string) {
//     accessToken = access;
//     window.localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
//   },

//   getAccessToken(): string | null {
//     return accessToken;
//   },

//   getRefreshToken(): string | null {
//     return window.localStorage.getItem(REFRESH_TOKEN_KEY);
//   },

//   setAccessToken(access: string) {
//     accessToken = access;
//   },

//   clearTokens() {
//     accessToken = null;
//     window.localStorage.removeItem(REFRESH_TOKEN_KEY);
//   },

//   hasRefreshToken(): boolean {
//     return window.localStorage.getItem(REFRESH_TOKEN_KEY) !== null;
//   },
// };


let accessToken: string | null = null;

const ACCESS_TOKEN_KEY = "questboard_access_token";
const REFRESH_TOKEN_KEY = "questboard_refresh_token";

export const tokenStorage = {
  setTokens(access: string, refresh: string) {
    accessToken = access;

    window.localStorage.setItem(ACCESS_TOKEN_KEY, access);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  },

  getAccessToken(): string | null {
    if (accessToken) return accessToken;

    const stored = window.localStorage.getItem(ACCESS_TOKEN_KEY);
    accessToken = stored;
    return stored;
  },

  getRefreshToken(): string | null {
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setAccessToken(access: string) {
    accessToken = access;
    window.localStorage.setItem(ACCESS_TOKEN_KEY, access);
  },

  clearTokens() {
    accessToken = null;
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  hasRefreshToken(): boolean {
    return window.localStorage.getItem(REFRESH_TOKEN_KEY) !== null;
  },
};