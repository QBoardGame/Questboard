import React from "react";
import { useSelector } from "react-redux";
import { RootReducer } from "app/shared/rootReducer";
import "./styles/Sidebar.css";

type SidebarProps = {
  active?: "home" | "games" | "premium" | "challenges" | "profile" | "creator";
  onChange?: (key: "home" | "games" | "premium" | "challenges" | "profile" | "creator") => void;
  onLogout?: () => void;
};

export const Sidebar = ({ active = "home", onChange, onLogout }: SidebarProps) => {
  const profile = useSelector((state: RootReducer) => state.profile.data);
  const username = profile?.username || localStorage.getItem("username") || "You";
  const avatar = profile?.avatarUrl || localStorage.getItem("avatar") || "";
  const role = profile?.role?.toUpperCase();

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
      key: "challenges",
      label: "Challenges",
      aria: "Challenges",
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm1.5 4.5v2h7v-2h-7zm0 4v2h7v-2h-7zm0 4v1h4v-1h-4z" />
        </svg>
      ),
    },
  ];

  if (role === "STREAMER" || role === "BRAND") {
    items.splice(3, 0, {
      key: "creator",
      label: "Creator Dashboard",
      aria: "Creator Dashboard",
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M4 5h16v14H4z" fill="none" />
          <path d="M7 8h10v2H7zm0 5h6v2H7z" />
        </svg>
      ),
    });
  }

  const handleClick = (key: any) => {
    if (onChange) onChange(key);
  };

  return (
    <nav className="sidebar" aria-label="Main sidebar">
      <ul className="sidebar_list">
        {items.map((it) => (
          <li key={it.key} className={`sidebar_item ${active === it.key ? "active" : ""}`}>
            <button
              type="button"
              className="sidebar_button"
              aria-label={it.aria}
              onClick={() => handleClick(it.key)}
            >
              <span className="sidebar_icon">{it.icon}</span>
              <span className="sidebar_label">{it.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="sidebar_footer">
        <div className="profile" tabIndex={0}>
          {avatar ? (
            <img className="profile_avatar" src={avatar} alt={username} />
          ) : (
            <div className="profile_avatar profile_placeholder">{username.charAt(0).toUpperCase()}</div>
          )}

          <div className="profile_menu" role="menu">
            <button type="button" className="profile_menu-item" onClick={() => handleClick("profile")}>
              Go to profile
            </button>
            <button type="button" className="profile_menu-item" onClick={() => window.location.href = "overwolf://settings"}>
              Settings
            </button>
            <button type="button" className="profile_menu-item" onClick={() => onLogout && onLogout()}>
              Log out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
