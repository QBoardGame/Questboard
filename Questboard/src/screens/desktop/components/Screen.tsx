import { useState } from "react";
import { DesktopHeader } from "./DesktopHeader";
import { useDesktopAuth } from "./auth/useDesktopAuth";
import { LoginPage } from "./auth/LoginPage";
import { SignupPage } from "./auth/SignupPage";
import { Dashboard } from "./Dashboard";
import Sidebar from "./Sidebar";
import styles from "./styles/Screen.module.css";

type ScreenKey = "home" | "games" | "premium" | "profile";

const Screen = () => {
  const [activeScreen, setActiveScreen] = useState<ScreenKey>("home");
  const {
    isAuthenticated,
    mode,
    signInWithGoogle,
    loginWithCredentials,
    registerWithCredentials,
    switchMode,
    logout,
  } = useDesktopAuth();

  const authContent = mode === "login" ? (
    <LoginPage
      onGoogleLogin={signInWithGoogle}
      onSwitchMode={switchMode}
      onLogin={loginWithCredentials}
    />
  ) : (
    <SignupPage
      onGoogleSignup={signInWithGoogle}
      onSwitchMode={switchMode}
      onRegister={registerWithCredentials}
    />
  );

  return (
    <div className={styles.desktop}>
      <DesktopHeader />
      {isAuthenticated ? (
        <>
          <Sidebar
            active={activeScreen}
            onChange={setActiveScreen}
            onLogout={logout}
          />
          <div className={styles.desktop__containerDashboard}>
            <Dashboard activeScreen={activeScreen} />
          </div>
        </>
      ) : (
        <div className={styles.desktop__containerAuth}>{authContent}</div>
      )}
    </div>
  );
};

export default Screen;
