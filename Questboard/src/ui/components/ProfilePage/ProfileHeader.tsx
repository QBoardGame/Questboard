// ProfileHeader.tsx

import { useSelector } from "react-redux";
import { RootReducer } from "../../../shared/rootReducer";

export const ProfileHeader = () => {
  const { data: user } = useSelector(
    (state: RootReducer) => state.profile
  );

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#111827]">
      <div className="absolute inset-0 bg-gradient-to-r from-black via-[#0f172a] to-[#14532d]" />

      <div className="relative flex items-center gap-8 p-8">
        <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-lime-400 bg-[#1e293b]">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.username}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <span className="text-4xl font-bold text-lime-400">
              {user?.username?.charAt(0)?.toUpperCase()}
            </span>
          )}
        </div>

        <div>
          <h1 className="text-4xl font-bold uppercase text-white">
            {user?.username}
          </h1>

          <p className="mt-2 text-slate-300">
            {user?.membership || "Free Tier"}
          </p>
        </div>
      </div>
    </div>
  );
};