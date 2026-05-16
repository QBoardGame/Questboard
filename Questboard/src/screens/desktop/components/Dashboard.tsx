import { useMemo, useState } from "react";
import { HomeContent } from "./HomeContent";
import { GamesContent } from "./GamesContent";
import { PremiumContent } from "./PremiumContent";
import { ProfileContent } from "./ProfileContent";
import { Title } from "components/Title/Title";
import styles from "./styles/Screen.module.css";
import Sidebar from "./Sidebar";

type DashboardProps = {
  onLogout: () => void;
};

type ScreenKey = "home" | "games" | "premium" | "profile";

const navigationItems: Array<{ key: ScreenKey; label: string }> = [
  { key: "home", label: "Home" },
  { key: "games", label: "Games" },
  { key: "premium", label: "Premium" },
  { key: "profile", label: "Profile" },
];

export const Dashboard = ({ onLogout }: DashboardProps) => {
  const [activeScreen, setActiveScreen] = useState<ScreenKey>("home");

  const activeContent = useMemo(() => {
    switch (activeScreen) {
      case "games":
        return <GamesContent />;
      case "premium":
        return <PremiumContent />;
      case "profile":
        return <ProfileContent />;
      default:
        return <HomeContent />;
    }
  }, [activeScreen]);

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardHeader}>
        <button className={styles.logoutButton} onClick={onLogout}>
          Log out
        </button>
      </div>

      <div className={styles.dashboardLayout}>
        <Sidebar active={activeScreen} onChange={(k) => setActiveScreen(k)} onLogout={onLogout} />

        <main className={styles.dashboardContent}>{activeContent}</main>
      </div>
    </div>
  );
};
