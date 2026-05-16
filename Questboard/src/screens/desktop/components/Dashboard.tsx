import { useMemo, useState } from "react";
import { HomeContent } from "./HomeContent";
import { GamesContent } from "./GamesContent";
import { PremiumContent } from "./PremiumContent";
import { ProfileContent } from "./ProfileContent";
import { Title } from "components/Title/Title";
import styles from "./styles/Screen.module.css";

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
        <div>
          <Title color="black">Questboard Dashboard</Title>
          <p className={styles.dashboardIntro}>
            You are signed in. This is your desktop dashboard for game stats, session details,
            and quick navigation.
          </p>
        </div>
        <button className={styles.logoutButton} onClick={onLogout}>
          Log out
        </button>
      </div>

      <div className={styles.dashboardLayout}>
        <aside className={styles.dashboardNav}>
          <div className={styles.navTitle}>Navigation</div>
          <div className={styles.navList}>
            {navigationItems.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`${styles.navButton} ${
                  activeScreen === item.key ? styles.navButtonActive : ""
                }`}
                onClick={() => setActiveScreen(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        <main className={styles.dashboardContent}>{activeContent}</main>
      </div>
    </div>
  );
};
