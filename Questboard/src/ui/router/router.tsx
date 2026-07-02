import { ReactNode } from 'react';
import { Dashboard } from '../pages/Dashboard';
import { GamesContent } from '../pages/GamesContent';
import { ProfileContent } from '../pages/ProfileContent';
import { Login } from '../pages/Login';
import { SignupPage } from '../pages/SignupPage';
import {
  loginWithCredentials,
  registerWithCredentials,
  sendForgotPasswordEmail,
} from '../../shared/api';
import { tokenStorage } from '../../lib/tokenStorage';
import { PremiumContent } from '../pages/PremiumContent';
import ComingSoonPage from '../pages/shared/CommingSoonPage';
import { ForgotPassword } from '../pages/ForgotPassword';
import { PrivacyPage } from '../pages/PrivacyPage';
import { TermsPage } from '../pages/TermsPage';

interface RouterProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onAuthSuccess?: () => void;
}

export const Router: React.FC<RouterProps> = ({
  currentRoute,
  onNavigate,
  onAuthSuccess,
}) => {
  const handleLogin = async (credentials: {
    email: string;
    password: string;
    authType: string;
  }) => {
    try {
      const response = await loginWithCredentials({
        email: credentials.email,
        password: credentials.password,
        authType: credentials.authType,
      });

      if (response.accessToken && response.refreshToken) {
        tokenStorage.setTokens(response.accessToken, response.refreshToken);
        onAuthSuccess?.();
        onNavigate('home');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const handleRegister = async (credentials: {
    username: string;
    email: string;
    password: string;
    authType: string;
    acceptedTerms: boolean;
  }) => {
    try {
      const response = await registerWithCredentials({
        username: credentials.username,
        email: credentials.email,
        password: credentials.password,
        authType: credentials.authType,
        acceptedTerms: credentials.acceptedTerms
      });

      if (response.accessToken && response.refreshToken) {
        tokenStorage.setTokens(response.accessToken, response.refreshToken);
        onAuthSuccess?.();
        onNavigate('home');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const openInBrowser = (url: string) => {
    if (window?.overwolf?.utils?.openUrlInDefaultBrowser) {
      window.overwolf.utils.openUrlInDefaultBrowser(url);
    } else {
      window.open(url, '_blank');
    }
  };

  // const handleGoogleLogin = () => {
  //   console.log('Google login requested');
  // };

  // const handleGoogleSignup = () => {
  //   console.log('Google signup requested');
  // };

  // const handleGoogleLogin = () => {
  //   try {
  //     const url = `${process.env.API_URL}/auth/google?mode=login`;
  //     openInBrowser(url);
  //   } catch (error) {
  //     console.error('Google login failed to start:', error);
  //   }
  // };

  // const handleGoogleSignup = () => {
  //   try {
  //     const url = `${process.env.API_URLL}/auth/google?mode=register`;
  //     openInBrowser(url);
  //   } catch (error) {
  //     console.error('Google signup failed to start:', error);
  //   }
  // };

  const handleGoogleLogin = () => {
    try {
      // const url = `${process.env.API_URL}/auth/google/start?redirect=aurum://auth/callback`;
      const url = `${
        process.env.API_URL
      }/auth/google/start?redirect=${encodeURIComponent(
        'http://127.0.0.1:3000/auth/google/callback',
      )}`;
      // window.overwolf?.utils?.openUrlInDefaultBrowser(url) ??
      //   window.open(url, '_blank');
      if (window.overwolf?.utils?.openUrlInDefaultBrowser) {
        window.overwolf.utils.openUrlInDefaultBrowser(url);
      } else {
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  const handleGoogleSignup = () => {
    try {
      // const url = `${process.env.API_URL}/auth/google/start?redirect=aurum://auth/callback`;
      const url = `${
        process.env.API_URL
      }/auth/google/start?redirect=${encodeURIComponent(
        'http://127.0.0.1:3000/auth/google/callback',
      )}`;

      // window.overwolf?.utils?.openUrlInDefaultBrowser(url) ??
      //   window.open(url, '_blank');
      if (window.overwolf?.utils?.openUrlInDefaultBrowser) {
        window.overwolf.utils.openUrlInDefaultBrowser(url);
      } else {
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error('Google signup failed:', error);
    }
  };

  const handleForgotPasswordRequest = async (email: string) => {
    try {
      await sendForgotPasswordEmail(email);
    } catch (error) {
      console.error('Forgot password failed:', error);
      throw error;
    }
  };

  const renderPage = (): ReactNode => {
    switch (currentRoute) {
      case 'home':
      case 'dashboard':
        return <Dashboard onNavigate={onNavigate} />;
      // case 'games':
      //   return <GamesContent />;
      case 'store':
        return (
          <ComingSoonPage
            pageName="Store"
            description="Get ready for premium rewards and exclusive content."
          />
        );
      case 'challenges':
        return (
          <ComingSoonPage
            pageName="Challenges"
            description="Custom challenges are under development."
          />
        );
      case 'forgot-password':
        return (
          <ForgotPassword
            onBackToLogin={() => onNavigate('login')}
            onSendResetLink={handleForgotPasswordRequest}
          />
        );
      case 'premiumContent':
        return <PremiumContent />;
      case 'profile':
        return <ProfileContent />;
      case 'creator':
        return (
          <ComingSoonPage
            pageName="Creator Dashboard"
            description="Your creative space is coming soon."
          />
        );
      case 'login':
        return (
          <Login
            onGoogleLogin={handleGoogleLogin}
            onSwitchMode={() => onNavigate('register')}
            onLogin={handleLogin}
            onForgotPassword={() => onNavigate('forgot-password')}
          />
        );
      case 'register':
        return (
          <SignupPage
            onGoogleSignup={handleGoogleSignup}
            onSwitchMode={() => onNavigate('login')}
            onRegister={handleRegister}
            onOpenTerms={() => onNavigate('terms')}
            onOpenPrivacy={() => onNavigate('privacy')}
          />
        );

      case 'privacy':
        return <PrivacyPage onBack={() => onNavigate('register')} />;

      case 'terms':
        return <TermsPage onBack={() => onNavigate('register')} />;
      default:
        return <div>Page not found</div>;
    }
  };

  return <>{renderPage()}</>;
};
