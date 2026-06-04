// import { useSelector } from "react-redux";
// import { RootReducer } from "../../shared/rootReducer";
// // import type { UserProfile } from "app/shared/profileSlice";

// export const ProfileContent = () => {
//   const { data: user, loading, error } = useSelector((state: RootReducer) => state.profile);

//   return (
//     <div className="space-y-8">
//       <section className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
//         <div className="mb-6">
//           <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Profile</p>
//           <h3 className="mt-2 text-xl font-semibold text-slate-900">Your player profile</h3>
//         </div>

//         {loading ? (
//           <p>Loading...</p>
//         ) : error ? (
//           <p className="text-red-500">{error}</p>
//         ) : (
//           <div className="grid gap-4 sm:grid-cols-2">
//             <div className="rounded-3xl bg-slate-50 p-5 flex items-center gap-4">
//               {user?.avatarUrl ? (
//                 // eslint-disable-next-line jsx-a11y/img-redundant-alt
//                 <img src={user.avatarUrl} alt="avatar" className="w-12 h-12 rounded-full" />
//               ) : (
//                 <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-lg font-semibold text-slate-700">
//                   {user?.username?.charAt(0)?.toUpperCase()}
//                 </div>
//               )}
//               <div>
//                 <p className="text-sm text-slate-500">Username</p>
//                 <p className="mt-2 text-lg font-semibold text-slate-900">{user?.username || "—"}</p>
//               </div>
//             </div>

//             <div className="rounded-3xl bg-slate-50 p-5">
//               <p className="text-sm text-slate-500">Membership</p>
//               <p className="mt-2 text-lg font-semibold text-slate-900">{user?.membership || "Free tier"}</p>
//             </div>

//             <div className="rounded-3xl bg-slate-50 p-5">
//               <p className="text-sm text-slate-500">Email</p>
//               <p className="mt-2 text-lg font-semibold text-slate-900">{user?.email || "—"}</p>
//             </div>

//             <div className="rounded-3xl bg-slate-50 p-5">
//               <p className="text-sm text-slate-500">Role</p>
//               <p className="mt-2 text-lg font-semibold text-slate-900">{user?.role || "Player"}</p>
//             </div>

//             {/* <div className="rounded-3xl bg-slate-50 p-5">
//               <p className="text-sm text-slate-500">Achievements</p>
//               <p className="mt-2 text-lg font-semibold text-slate-900">{typeof user?.achievementsCount === "number" ? `${user.achievementsCount} unlocked` : "—"}</p>
//             </div> */}
//           </div>
//         )}
//       </section>

//       <section className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
//         <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Settings</p>
//         <div className="mt-5 grid gap-4">
//           <div className="rounded-3xl bg-slate-50 p-5">
//             <p className="text-sm text-slate-500">Language</p>
//             <p className="mt-2 text-base font-semibold text-slate-900">English</p>
//           </div>
//           <div className="rounded-3xl bg-slate-50 p-5">
//             <p className="text-sm text-slate-500">Notifications</p>
//             <p className="mt-2 text-base font-semibold text-slate-900">Enabled</p>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };


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