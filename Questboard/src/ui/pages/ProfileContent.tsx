// ProfileContent.tsx

import { ProfileHeader } from "../components/ProfilePage/ProfileHeader";
import { WeeklyEarningsChart } from "../components/ProfilePage/WeeklyEarningsChart";
import { RecentTransactions } from "../components/ProfilePage/RecentTransactions";
// import { SettingsCard } from "./SettingsCard";

export const ProfileContent = () => {
  return (
    <div className="space-y-6">
      <ProfileHeader />

      <div className="grid gap-6">
        <WeeklyEarningsChart />
      </div>

      <RecentTransactions />

      {/* <SettingsCard /> */}
    </div>
  );
};