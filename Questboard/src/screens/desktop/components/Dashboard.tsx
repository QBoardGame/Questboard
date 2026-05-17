import { useMemo } from "react";
import { HomeContent } from "./HomeContent";
import { GamesContent } from "./GamesContent";
import { PremiumContent } from "./PremiumContent";
import { ProfileContent } from "./ProfileContent";
import styles from "./styles/Screen.module.css";

type DashboardProps = {
  activeScreen: "home" | "games" | "premium" | "profile";
};

export const Dashboard = ({ activeScreen }: DashboardProps) => {

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
      <div className={styles.dashboardLayout}>
        <main className={styles.dashboardContent}>{activeContent}</main>

        <aside className={styles.adsColumn} aria-hidden="true">
          {/* Placeholder for ads / promotional content */}
          <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{textAlign: 'center', color: 'var(--neutral-6)'}}>
              <div style={{fontWeight: 700, marginBottom: 8}}>Sponsored</div>
              <div style={{fontSize: 12}}>Ad space reserved (col-4)</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
