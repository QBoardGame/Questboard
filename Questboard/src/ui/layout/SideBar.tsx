import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootReducer } from '../../shared/rootReducer';

type SidebarProps = {
  active?: string;
  onNavigate?: (
    key: 'home' | 'games' | 'premium' | 'challenges' | 'profile' | 'creator',
  ) => void;
  onLogout?: () => void;
};

export const Sidebar = ({
  active = 'home',
  onNavigate,
  onLogout,
}: SidebarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const profile = useSelector((state: RootReducer) => state.profile.data);
  const username =
    profile?.username || localStorage.getItem('username') || 'You';
  const avatar = profile?.avatarUrl || localStorage.getItem('avatar') || '';
  const role = profile?.role?.toUpperCase();

  const items: Array<{
    key: any;
    label: string;
    aria: string;
    icon: JSX.Element;
  }> = [
    {
      key: 'home',
      label: 'Home',
      aria: 'Home',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5z" />
        </svg>
      ),
    },
    {
      key: 'games',
      label: 'Games',
      aria: 'Games',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M18 3h-2.5a1.5 1.5 0 0 0-1.24.64L11 8 9.74 6.64A1.5 1.5 0 0 0 8.5 6H6a2 2 0 0 0-2 2v8a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3z" />
        </svg>
      ),
    },
    {
      key: 'store',
      label: 'Store',
      aria: 'Store',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 2l3 6 6 .5-4.5 3.5L18 20l-6-3-6 3 .5-8L2 8.5 8 8z" />
        </svg>
      ),
    },
    {
      key: 'challenges',
      label: 'Challenges',
      aria: 'Challenges',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm1.5 4.5v2h7v-2h-7zm0 4v2h7v-2h-7zm0 4v1h4v-1h-4z" />
        </svg>
      ),
    },
  ];

  if (role === 'STREAMER' || role === 'BRAND') {
    items.splice(3, 0, {
      key: 'creator',
      label: 'Creator Dashboard',
      aria: 'Creator Dashboard',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M4 5h16v14H4z" fill="none" />
          <path d="M7 8h10v2H7zm0 5h6v2H7z" />
        </svg>
      ),
    });
  }

  const handleClick = (key: any) => {
    if (onNavigate) onNavigate(key);
  };

  return (
    <nav
      className="fixed left-4 top-[70px] z-50 flex h-[calc(100vh-84px)] min-h-[60vh] w-[72px] flex-col justify-between items-center rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.02))] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 ease-in-out"
      aria-label="Main sidebar"
    >
      <ul className="flex-1 flex flex-col space-y-1 p-4 overflow-visible">
        {items.map((it) => (
          <li key={it.key} className="flex items-center justify-center">
            <button
              type="button"
              className={`group relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200
  ${
    active === it.key
      ? 'bg-slate-800 text-sky-400 shadow-[0_0_0_2px_rgba(56,189,248,0.5)]'
      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
  }
`}
              aria-label={it.aria}
              aria-pressed={active === it.key}
              onClick={() => handleClick(it.key)}
            >
              {/* <span className="flex-shrink-0 text-current">{it.icon}</span> */}
              <span
                className={`flex items-center justify-center transition-all duration-200
    group-hover:scale-110 group-active:scale-95
    ${active === it.key ? 'scale-105' : 'scale-100'}
  `}
              >
                {it.icon}
              </span>
              <span
                className="absolute left-14 top-1/2 -translate-y-1/2
             whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs
             text-slate-200 opacity-0 scale-95
             transition-all duration-150
             group-hover:opacity-100 group-hover:scale-100"
              >
                {it.label}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="border-t border-slate-800 p-4">
        <div
          className="relative cursor-pointer"
          role="button"
          tabIndex={0}
          onClick={() => setMenuOpen(!menuOpen)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setMenuOpen(!menuOpen);
            }
          }}
        >
          {avatar ? (
            <img
              className="w-10 h-10 rounded-full object-cover border border-slate-700"
              src={avatar}
              alt={username}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center font-semibold text-sm border border-slate-700">
              {username.charAt(0).toUpperCase()}
            </div>
          )}

          {menuOpen && (
            <div
              className="absolute bottom-full left-0 mb-2 w-48 bg-slate-800 rounded-lg shadow-lg border border-slate-700 z-50"
              role="menu"
            >
              <button
                type="button"
                className="w-full text-left px-4 py-3 text-sm text-slate-200 hover:bg-slate-700 transition first:rounded-t-lg"
                onClick={() => {
                  handleClick('profile');
                  setMenuOpen(false);
                }}
              >
                Go to profile
              </button>
              <button
                type="button"
                className="w-full text-left px-4 py-3 text-sm text-slate-200 hover:bg-slate-700 transition"
                onClick={() => {
                  window.location.href = 'overwolf://settings';
                  setMenuOpen(false);
                }}
              >
                Settings
              </button>
              <button
                type="button"
                className="w-full text-left px-4 py-3 text-sm text-red-300 hover:bg-slate-700 transition last:rounded-b-lg"
                onClick={() => {
                  onLogout && onLogout();
                  setMenuOpen(false);
                }}
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
