import { ReactNode } from 'react';
import { Dashboard } from '../pages/Dashboard';
import { GamesContent } from '../pages/GamesContent';
import { ProfileContent } from '../pages/ProfileContent';
import { Login } from '../pages/Login';
import { SignupPage } from '../pages/SignupPage';
import {
  loginWithCredentials,
  registerWithCredentials,
} from '../../shared/api';
import { tokenStorage } from '../../lib/tokenStorage';
import { PremiumContent } from '../pages/PremiumContent';
import ComingSoonPage from '../pages/shared/CommingSoonPage';

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
  }) => {
    try {
      const response = await registerWithCredentials({
        username: credentials.username,
        email: credentials.email,
        password: credentials.password,
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

  const handleGoogleLogin = () => {
    console.log('Google login requested');
  };

  const handleGoogleSignup = () => {
    console.log('Google signup requested');
  };

  const renderPage = (): ReactNode => {
    switch (currentRoute) {
      case 'home':
      case 'dashboard':
        return <Dashboard />;
      case 'games':
        return <GamesContent />;
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
          />
        );
      case 'register':
        return (
          <SignupPage
            onGoogleSignup={handleGoogleSignup}
            onSwitchMode={() => onNavigate('login')}
            onRegister={handleRegister}
          />
        );
      default:
        return <div>Page not found</div>;
    }
  };

  return <>{renderPage()}</>;
};
