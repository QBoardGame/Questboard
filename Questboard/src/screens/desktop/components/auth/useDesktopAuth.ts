import { useCallback, useEffect, useState } from "react";
import { loginWithThirdParty, ThirdPartyProvider } from "lib/auth";
import { tokenStorage } from "lib/tokenStorage";
import { wsManager } from "lib/websocket";
import { log } from "lib/log";
import {
  loginWithCredentials as loginRequest,
  registerWithCredentials as registerRequest,
  LoginCredentials,
  SignupCredentials,
  AuthResponse,
} from "./api";

type AuthMode = "login" | "signup";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  provider: string;
  [key: string]: unknown;
}

/**
 * Decode JWT token to extract user information
 */
function decodeToken(token: string): Record<string, unknown> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid token format");
    }

    const decoded = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    return decoded;
  } catch (error) {
    log(
      `Error decoding token: ${error}`,
      "src/screens/desktop/components/auth/useDesktopAuth.ts",
      "decodeToken"
    );
    return {};
  }
}

/**
 * Extract user data from JWT token and backend response
 */
function extractUserFromToken(
  token: string,
  backendResponse: AuthResponse
): AuthUser {
  const decoded = decodeToken(token);

  return {
    id: (decoded.sub as string) || "",
    email: backendResponse.email,
    role: (decoded.role as string) || "USER",
    provider: backendResponse.provider,
  };
}

export const useDesktopAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Check if user was previously authenticated and has valid tokens
   */
  useEffect(() => {
    const hasTokens = tokenStorage.hasTokens();
    if (hasTokens) {
      setIsAuthenticated(true);
      // TODO: Optionally restore user from localStorage or validate tokens with backend
    }
  }, []);

  /**
   * Handle successful authentication
   * - Store tokens
   * - Establish WebSocket connection
   * - Update auth state
   */
  const handleAuthSuccess = useCallback(
    async (response: AuthResponse) => {
      try {
        // Store tokens
        tokenStorage.setTokens(response.accessToken, response.refreshToken);

        // Extract user data from JWT
        const userData = extractUserFromToken(response.accessToken, response);
        setUser(userData);
        setIsAuthenticated(true);
        setError(null);

        log(
          "Authentication successful, establishing WebSocket connection",
          "src/screens/desktop/components/auth/useDesktopAuth.ts",
          "handleAuthSuccess"
        );

        // Establish WebSocket connection
        try {
          await wsManager.connect();
          log(
            "WebSocket connected successfully",
            "src/screens/desktop/components/auth/useDesktopAuth.ts",
            "handleAuthSuccess"
          );
        } catch (wsError) {
          // Log WebSocket error but don't fail auth
          log(
            `WebSocket connection failed: ${wsError}`,
            "src/screens/desktop/components/auth/useDesktopAuth.ts",
            "handleAuthSuccess"
          );
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Authentication failed";
        log(
          `Auth success handler error: ${errorMsg}`,
          "src/screens/desktop/components/auth/useDesktopAuth.ts",
          "handleAuthSuccess"
        );
        setError(errorMsg);
        setIsAuthenticated(false);
      }
    },
    []
  );

  /**
   * Login with email and password
   */
  const loginWithCredentials = useCallback(
    async (credentials: LoginCredentials) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await loginRequest(credentials);
        await handleAuthSuccess(response);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Login failed";
        setError(errorMsg);
        setIsAuthenticated(false);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [handleAuthSuccess]
  );

  /**
   * Register with email, password, and username
   */
  const registerWithCredentials = useCallback(
    async (credentials: SignupCredentials) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await registerRequest(credentials);
        await handleAuthSuccess(response);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Registration failed";
        setError(errorMsg);
        setIsAuthenticated(false);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [handleAuthSuccess]
  );

  /**
   * Login with Google OAuth
   * Note: This is a placeholder - actual Google OAuth flow depends on backend
   */
  const signInWithGoogle = useCallback(() => {
    loginWithThirdParty(ThirdPartyProvider.Google);
    // TODO: Handle Google OAuth callback and token exchange
  }, []);

  /**
   * Logout
   * - Clear tokens
   * - Disconnect WebSocket
   * - Reset auth state
   */
  const logout = useCallback(() => {
    log(
      "Logging out - clearing tokens and disconnecting WebSocket",
      "src/screens/desktop/components/auth/useDesktopAuth.ts",
      "logout"
    );

    tokenStorage.clearTokens();
    wsManager.disconnect();
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
  }, []);

  const switchMode = useCallback(() => {
    setMode((currentMode) => (currentMode === "login" ? "signup" : "login"));
  }, []);

  return {
    isAuthenticated,
    mode,
    user,
    isLoading,
    error,
    signInWithGoogle,
    loginWithCredentials,
    registerWithCredentials,
    switchMode,
    logout,
  };
};
