import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Router } from '../router/router';
import { AppBar } from './AppBar';
import { Sidebar } from './SideBar';
import { tokenStorage } from '../../lib/tokenStorage';
import { fetchProfile, updateWallet } from '../../shared/profileSlice';
import { store, type AppDispatch } from '../../shared/store';
import { AdsSlot } from '../../features/monetization/components/AdsSlot';
import { logout } from '../../shared/api';
import { LoadingScreen } from '../components/LoadingScreen';
import { wsClient } from '../../lib/wsClient';

type AppShellProps = {
  initialAuthenticated?: boolean;
};

export const AppShell: React.FC<AppShellProps> = () => {
  const [adStates, setAdStates] = useState<boolean[]>([false, false]);

  const updateAdState = (index: number, available: boolean) => {
    setAdStates((prev) => {
      const next = [...prev];
      next[index] = available;
      return next;
    });
  };

  useEffect(() => {
    const listener = (message: any) => {
      const { id, content } = message;

      if (id === 'wallet_update') {
        console.log('DESKTOP RECEIVED WALLET UPDATE', content);

        store.dispatch(updateWallet(content));
      }
    };

    overwolf.windows.onMessageReceived.addListener(listener);

    return () => {
      overwolf.windows.onMessageReceived.removeListener(listener);
    };
  }, []);

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

  const handleLogout = async () => {
    try {
      await logout(); // API call
    } catch (e) {
      console.warn('logout failed but continuing');
    } finally {
      setIsAuthenticated(false);
      setCurrentRoute('login');
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = tokenStorage.getAccessToken();
        console.log('TOKEN BEFORE FETCH:', accessToken);

        if (accessToken) {
          await dispatch(fetchProfile()).unwrap();

          setIsAuthenticated(true);
          setCurrentRoute('home');
        } else {
          setIsAuthenticated(false);
          setCurrentRoute('login');
        }

        // Wait for fonts and one paint frame
        if ('fonts' in document) {
          await (document as any).fonts.ready;
        }

        await new Promise((resolve) =>
          requestAnimationFrame(() => resolve(true)),
        );
      } catch (error) {
        tokenStorage.clearTokens();
        setCurrentRoute('login');
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) return;

    wsClient.connect().catch(console.error);

    return () => {
      wsClient.disconnect();
    };
  }, [isAuthenticated]);

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

  // const handleAuthSuccess = async () => {
  //   await dispatch(fetchProfile());
  //   setIsAuthenticated(true);
  // };

  const handleAuthSuccess = async () => {
    await dispatch(fetchProfile()).unwrap();
    setIsAuthenticated(true);
    setCurrentRoute('home');
  };

  if (isLoading) {
    return <LoadingScreen />;
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
            onLogout={handleLogout}
          />
        </aside>

        {/* MAIN CONTENT */}
        {/* <main className="app-scroll flex-1 overflow-y-auto p-6">
          <Router currentRoute={currentRoute} onNavigate={handleNavigate} />
        </main> */}
        {/* <main className="flex-1 overflow-hidden p-6">
          <div className="app-scroll h-full overflow-y-auto pr-2">
            <Router currentRoute={currentRoute} onNavigate={handleNavigate} />
          </div>
        </main> */}
        <main className="flex flex-1 overflow-hidden p-6">
          <div className="app-scroll min-h-0 flex-1 overflow-y-auto pr-2">
            <Router currentRoute={currentRoute} onNavigate={handleNavigate} />
          </div>
        </main>

        {/* ADS PANEL - FREE USERS ONLY */}
        {user.membership === 'free' && (
          <aside className="w-80 shrink-0 bg-slate-900/50">
            {/* Header */}
            {/* <div className="border-b border-slate-800 p-4">
              <button
                onClick={() => handleNavigate('premiumContent')} // or open pricing modal
                className="flex w-full items-center justify-center gap-2 rounded-full bg-lime-400 px-5 py-3 font-semibold text-black transition hover:bg-lime-300"
              >
                Remove Ads
                <span>↗</span>
              </button>
            </div> */}

            {/* Ads */}
            {/* <div className="flex flex-col items-center space-y-4 p-4">
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
            </div> */}
            <div className="flex flex-col items-center space-y-4 p-4">
              <AdsSlot
                width={400}
                height={300}
                onAvailable={(v) => updateAdState(0, v)}
              />

              <AdsSlot
                width={400}
                height={300}
                onAvailable={(v) => updateAdState(1, v)}
              />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
