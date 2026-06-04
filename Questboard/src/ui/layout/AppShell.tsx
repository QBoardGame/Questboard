import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Router } from '../router/router';
import { AppBar } from './AppBar';
import { Sidebar } from './SideBar';
import { tokenStorage } from '../../lib/tokenStorage';
import { fetchProfile } from '../../shared/profileSlice';
import type { AppDispatch } from '../../shared/store';
import { AdsSlot } from '../../features/monetization/components/AdsSlot';

export const AppShell: React.FC = () => {
  const [adStates, setAdStates] = useState<boolean[]>([false, false]);

  const updateAdState = (index: number, available: boolean) => {
    setAdStates((prev) => {
      const next = [...prev];
      next[index] = available;
      return next;
    });
  };

  const visibleCount = adStates.filter(Boolean).length;
  const dispatch = useDispatch<AppDispatch>();

  const [currentRoute, setCurrentRoute] = useState(() => {
    const hasToken = tokenStorage.getAccessToken();
    return hasToken ? 'home' : 'login';
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Replace with actual membership from profile/store
  const user = {
    membership: 'free', // free | premium
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = tokenStorage.getAccessToken();

        if (accessToken) {
          await dispatch(fetchProfile());
          setIsAuthenticated(true);
          setCurrentRoute('home');
        } else {
          setCurrentRoute('login');
        }
      } catch (error) {
        tokenStorage.clearTokens();
        setCurrentRoute('login');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [dispatch]);

  useEffect(() => {
    const handleNavigate = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      setCurrentRoute(customEvent.detail);
    };

    window.addEventListener('navigate', handleNavigate);

    return () => {
      window.removeEventListener('navigate', handleNavigate);
    };
  }, []);

  const handleNavigate = (route: string) => {
    setCurrentRoute(route);
  };

  const handleAuthSuccess = async () => {
    await dispatch(fetchProfile());
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Router
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-white">
      {/* TOP APP BAR */}
      <AppBar />

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR */}
        <aside className="w-24 shrink-0 ">
          <Sidebar
            active={currentRoute === 'dashboard' ? 'home' : currentRoute}
            onNavigate={handleNavigate}
          />
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-auto p-6">
          <Router currentRoute={currentRoute} onNavigate={handleNavigate} />
        </main>

        {/* ADS PANEL - FREE USERS ONLY */}
        {user.membership === 'free' && (
          <aside className="w-80 shrink-0 bg-slate-900/50">
            {/* Header */}
            <div className="border-b border-slate-800 p-4">
              <button
                onClick={() => handleNavigate('premiumContent')} // or open pricing modal
                className="flex w-full items-center justify-center gap-2 rounded-full bg-lime-400 px-5 py-3 font-semibold text-black transition hover:bg-lime-300"
              >
                Remove Ads
                <span>↗</span>
              </button>
            </div>

            {/* Ads */}
            <div className="flex flex-col items-center space-y-4 p-4">
              {adStates[0] && (
                <AdsSlot
                  width={400}
                  height={300}
                  onAvailable={(v) => updateAdState(0, v)}
                />
              )}

              {adStates[1] && (
                <AdsSlot
                  width={400}
                  height={300}
                  onAvailable={(v) => updateAdState(1, v)}
                />
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
