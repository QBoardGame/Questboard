import React from "react";
import "./styles/Sidebar.css";

type SidebarProps = {
  active?: "home" | "games" | "premium" | "profile";
  onChange?: (key: "home" | "games" | "premium" | "profile") => void;
  onLogout?: () => void;
};

export const Sidebar = ({ active = "home", onChange, onLogout }: SidebarProps) => {
  const username = localStorage.getItem("username") || "You";
  const avatar = localStorage.getItem("avatar") || "";

  const items: Array<{ key: any; label: string; aria: string; icon: JSX.Element }> = [
    {
      key: "home",
      label: "Home",
      aria: "Home",
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5z" />
        </svg>
      ),
    },
    {
      key: "games",
      label: "Games",
      aria: "Games",
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M18 3h-2.5a1.5 1.5 0 0 0-1.24.64L11 8 9.74 6.64A1.5 1.5 0 0 0 8.5 6H6a2 2 0 0 0-2 2v8a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3z" />
        </svg>
      ),
    },
    {
      key: "premium",
      label: "Store",
      aria: "Store",
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 2l3 6 6 .5-4.5 3.5L18 20l-6-3-6 3 .5-8L2 8.5 8 8z" />
        </svg>
      ),
    },
    {
      key: "profile",
      label: "Profile",
      aria: "Profile",
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-4.4 0-8 2.2-8 4v2h16v-2c0-1.8-3.6-4-8-4z" />
        </svg>
      ),
    },
  ];

  const handleClick = (key: any) => {
    if (onChange) onChange(key);
  };

  return (
    <nav className="sidebar" aria-label="Main sidebar">
      <ul className="sidebar__list">
        {items.map((it) => (
          <li key={it.key} className={`sidebar__item ${active === it.key ? "active" : ""}`}>
            <button
              type="button"
              className="sidebar__button"
              aria-label={it.aria}
              onClick={() => handleClick(it.key)}
            >
              <span className="sidebar__icon">{it.icon}</span>
              <span className="sidebar__label">{it.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="sidebar__footer">
        <div className="profile" tabIndex={0}>
          {avatar ? (
            <img className="profile__avatar" src={avatar} alt={username} />
          ) : (
            <div className="profile__avatar profile__placeholder">{username.charAt(0).toUpperCase()}</div>
          )}
          <div className="profile__meta">
            <div className="profile__name">{username}</div>
          </div>

          <div className="profile__menu" role="menu">
            <button type="button" className="profile__menu-item" onClick={() => handleClick("profile")}>
              Go to profile
            </button>
            <button type="button" className="profile__menu-item" onClick={() => window.location.href = "overwolf://settings"}>
              Settings
            </button>
            <button type="button" className="profile__menu-item" onClick={() => onLogout && onLogout()}>
              Log out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
