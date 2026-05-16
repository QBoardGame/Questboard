import { useCallback, useEffect, useState } from "react";
import { loginWithThirdParty, ThirdPartyProvider } from "lib/auth";
import {
  loginWithCredentials as loginRequest,
  registerWithCredentials as registerRequest,
  LoginCredentials,
  SignupCredentials,
} from "./api";

type AuthMode = "login" | "signup";
const AUTH_STORAGE_KEY = "questboard-desktop-authenticated";

export const useDesktopAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");

  useEffect(() => {
    const storedValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(storedValue === "true");
  }, []);

  const persistAuth = useCallback(() => {
    window.localStorage.setItem(AUTH_STORAGE_KEY, "true");
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
  }, []);

  const signInWithGoogle = useCallback(() => {
    loginWithThirdParty(ThirdPartyProvider.Google);
    persistAuth();
  }, [persistAuth]);

  const loginWithCredentials = useCallback(
    async (credentials: LoginCredentials) => {
      await loginRequest(credentials);
      persistAuth();
    },
    [persistAuth]
  );

  const registerWithCredentials = useCallback(
    async (credentials: SignupCredentials) => {
      await registerRequest(credentials);
      persistAuth();
    },
    [persistAuth]
  );

  const switchMode = useCallback(() => {
    setMode((currentMode) => (currentMode === "login" ? "signup" : "login"));
  }, []);

  return {
    isAuthenticated,
    mode,
    signInWithGoogle,
    loginWithCredentials,
    registerWithCredentials,
    switchMode,
    logout,
  };
};
