import { DesktopHeader } from "./DesktopHeader";
import { useDesktopAuth } from "./auth/useDesktopAuth";
import { LoginPage } from "./auth/LoginPage";
import { SignupPage } from "./auth/SignupPage";
import { Dashboard } from "./Dashboard";
import styles from "./styles/Screen.module.css";

const Screen = () => {
  const {
    isAuthenticated,
    mode,
    signInWithGoogle,
    loginWithCredentials,
    registerWithCredentials,
    switchMode,
    logout,
  } = useDesktopAuth();

  const content = isAuthenticated ? (
    <Dashboard onLogout={logout} />
  ) : mode === "login" ? (
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
      <div className={styles.desktop__container}>{content}</div>
    </div>
  );
};

export default Screen;
