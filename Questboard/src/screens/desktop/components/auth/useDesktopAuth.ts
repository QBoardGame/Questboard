import { useCallback, useEffect, useState } from "react";
import { loginWithThirdParty, ThirdPartyProvider } from "lib/auth";
import { tokenStorage } from "lib/tokenStorage";
import {
  loginWithCredentials as loginRequest,
  registerWithCredentials as registerRequest,
  refreshTokens,
  AuthResponse,
  LoginCredentials,
  SignupCredentials,
} from "./api";

type AuthMode = "login" | "signup";

function applyAuthResponse(response: AuthResponse) {
  tokenStorage.setTokens(response.accessToken, response.refreshToken);
}

export const useDesktopAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isActive = true;

    const restoreSession = async () => {
      const refreshToken = tokenStorage.getRefreshToken();

      if (!refreshToken) {
        setIsAuthenticated(false);
        return;
      }

      setIsLoading(true);

      try {
        const response = await refreshTokens(refreshToken);

        if (!isActive) {
          return;
        }

        applyAuthResponse(response);
        setIsAuthenticated(true);
      } catch {
        if (!isActive) {
          return;
        }

        tokenStorage.clearTokens();
        setIsAuthenticated(false);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void restoreSession();

    return () => {
      isActive = false;
    };
  }, []);

  const persistAuth = useCallback((response: AuthResponse) => {
    applyAuthResponse(response);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clearTokens();
    setIsAuthenticated(false);
  }, []);

  const signInWithGoogle = useCallback(() => {
    loginWithThirdParty(ThirdPartyProvider.Google);
  }, []);

  const loginWithCredentials = useCallback(
    async (credentials: LoginCredentials) => {
      const response = await loginRequest(credentials);
      persistAuth(response);
    },
    [persistAuth]
  );

  const registerWithCredentials = useCallback(
    async (credentials: SignupCredentials) => {
      const response = await registerRequest(credentials);
      persistAuth(response);
    },
    [persistAuth]
  );

  const switchMode = useCallback(() => {
    setMode((currentMode) => (currentMode === "login" ? "signup" : "login"));
  }, []);

  return {
    isAuthenticated,
    isLoading,
    mode,
    signInWithGoogle,
    loginWithCredentials,
    registerWithCredentials,
    switchMode,
    logout,
  };
};
