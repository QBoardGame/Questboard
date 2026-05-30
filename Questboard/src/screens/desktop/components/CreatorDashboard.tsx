import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootReducer } from "app/shared/rootReducer";
import { DEFAULT_EVENT_TYPE, DEFAULT_GAME_ID, GAME_EVENT_TYPE_OPTIONS, GAME_OPTIONS, ValorantEventType, VALORANT_GUNS, GameId } from "./gameChallengeConfig";

export const CreatorDashboard = () => {
  const profile = useSelector((state: RootReducer) => state.profile.data);
  const role = profile?.role?.toUpperCase();
  const isBrand = role === "BRAND";
  const isStreamer = role === "STREAMER";

  const [showAdForm, setShowAdForm] = useState(false);
  const [showChallengeForm, setShowChallengeForm] = useState(false);
  const [adTitle, setAdTitle] = useState("");
  const [adUrl, setAdUrl] = useState("");
  const [adImageUrl, setAdImageUrl] = useState("");
  const [adImageFile, setAdImageFile] = useState<File | null>(null);
  const [adDescription, setAdDescription] = useState("");
  const [adStart, setAdStart] = useState("");
  const [adEnd, setAdEnd] = useState("");
  const [adCTA, setAdCTA] = useState("");
  const [challengeTitle, setChallengeTitle] = useState("");
  const [challengeDescription, setChallengeDescription] = useState("");
  const [eventType, setEventType] = useState<ValorantEventType>(DEFAULT_EVENT_TYPE);
  const [creatorType, setCreatorType] = useState(role || "STREAMER");
  const [visibility, setVisibility] = useState("public");
  const [rewardType, setRewardType] = useState("coins");
  const [rewardValue, setRewardValue] = useState("");
  const [maxUsers, setMaxUsers] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [gameId, setGameId] = useState(DEFAULT_GAME_ID);
  const [scheduleType, setScheduleType] = useState<"scheduled" | "live">("scheduled");
  const [startDay, setStartDay] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [startYear, setStartYear] = useState("");
  const [startHour, setStartHour] = useState("");
  const [startMinute, setStartMinute] = useState("");
  const [durationHours, setDurationHours] = useState("");
  const [selectedGun, setSelectedGun] = useState("");
  const [status, setStatus] = useState("draft");
  const [points, setPoints] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  const availableEventTypes = GAME_EVENT_TYPE_OPTIONS[gameId] ?? [];
  const selectedGameOption = GAME_OPTIONS.find((option) => option.id === gameId);

  const killEventTypes = [ValorantEventType.KILL, ValorantEventType.HEADSHOT, ValorantEventType.UTILITY_KILL];
  const showGunSelect = gameId === GameId.VALORANT && killEventTypes.includes(eventType as ValorantEventType);
  const availableGuns = VALORANT_GUNS;

  const monthOptions = [
    { value: "01", label: "Jan" },
    { value: "02", label: "Feb" },
    { value: "03", label: "Mar" },
    { value: "04", label: "Apr" },
    { value: "05", label: "May" },
    { value: "06", label: "Jun" },
    { value: "07", label: "Jul" },
    { value: "08", label: "Aug" },
    { value: "09", label: "Sep" },
    { value: "10", label: "Oct" },
    { value: "11", label: "Nov" },
    { value: "12", label: "Dec" },
  ];

  const dayOptions = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));
  const yearOptions = [new Date().getFullYear(), new Date().getFullYear() + 1].map(String);
  const hourOptions = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const minuteOptions = ["00", "15", "30", "45"];

  const startDateTime = (() => {
    if (scheduleType === "live") {
      return new Date().toISOString();
    }
    if (!startYear || !startMonth || !startDay || !startHour || !startMinute) return "";
    const date = new Date(`${startYear}-${startMonth}-${startDay}T${startHour}:${startMinute}:00`);
    return Number.isNaN(date.getTime()) ? "" : date.toISOString();
  })();

  const endDateTime = (() => {
    const duration = Number(durationHours);
    if (!startDateTime || duration <= 0) return "";
    const date = new Date(startDateTime);
    date.setMinutes(date.getMinutes() + duration * 60);
    return date.toISOString();
  })();

  const handleCreateChallengeClick = () => {
    setShowChallengeForm(true);
  };

  const handleCreateAdClick = () => {
    setShowAdForm(true);
  };

  const handleCancelAd = () => {
    setShowAdForm(false);
    setErrors([]);
  };

  const handleCancelChallenge = () => {
    setShowChallengeForm(false);
    setErrors([]);
  };

  const handleAdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: string[] = [];
    if (!adTitle.trim()) errs.push("Title is required");
    if (!adUrl.trim() && !adImageUrl.trim() && !adImageFile) errs.push("Either a URL or an image is required");
    if (adStart && adEnd && new Date(adStart) > new Date(adEnd)) errs.push("Start date must be before end date");
    setErrors(errs);
    if (errs.length) return;

    const form = new FormData();
    form.append("title", adTitle);
    form.append("url", adUrl);
    form.append("imageUrl", adImageUrl);
    if (adImageFile) form.append("imageFile", adImageFile);
    form.append("description", adDescription);
    form.append("start", adStart);
    form.append("end", adEnd);
    form.append("cta", adCTA);

    // TODO: replace with real API call
    console.log("Ad submit", Array.from(form.entries()));

    setShowAdForm(false);
    setAdTitle("");
    setAdUrl("");
    setAdImageUrl("");
    setAdImageFile(null);
    setAdDescription("");
    setAdStart("");
    setAdEnd("");
    setAdCTA("");
    setErrors([]);
  };

  const handleChallengeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: string[] = [];
    if (!challengeTitle.trim()) errs.push("Challenge title is required");
    if (!challengeDescription.trim()) errs.push("Challenge description is required");
    if (!selectedGameOption) errs.push("Game selection is required");
    if (!rewardValue.trim()) errs.push("Reward value is required");
    if (!maxUsers.trim()) errs.push("Max users is required");
    if (!targetValue.trim()) errs.push("Target value is required");
    if (scheduleType === "scheduled") {
      if (!startYear) errs.push("Start year is required");
      if (!startMonth) errs.push("Start month is required");
      if (!startDay) errs.push("Start day is required");
      if (!startHour) errs.push("Start hour is required");
      if (!startMinute) errs.push("Start minute is required");
    }
    if (!durationHours.trim() || Number(durationHours) <= 0) errs.push("Duration must be greater than 0");
    if (!startDateTime || !endDateTime) errs.push("Valid start and end times are required");
    if (showGunSelect && !selectedGun.trim()) errs.push("Gun type is required for this event");
    if (!points || points <= 0) errs.push("Points are required");
    setErrors(errs);
    if (errs.length) return;

    const payload = {
      title: challengeTitle,
      description: challengeDescription,
      event_type: eventType,
      creator_type: creatorType,
      visibility,
      reward_type: rewardType,
      reward_value: rewardValue,
      max_users: Number(maxUsers),
      target_value: Number(targetValue),
      game_id: gameId,
      gun_type: selectedGun || undefined,
      starts_at: startDateTime,
      ends_at: endDateTime,
      status,
      points,
    };

    console.log("Create challenge payload", payload);

    setShowChallengeForm(false);
    setChallengeTitle("");
    setChallengeDescription("");
    setEventType(DEFAULT_EVENT_TYPE);
    setCreatorType(role || "STREAMER");
    setVisibility("public");
    setRewardType("coins");
    setRewardValue("");
    setMaxUsers("");
    setTargetValue("");
    setGameId(DEFAULT_GAME_ID);
    setScheduleType("scheduled");
    setStartDay("");
    setStartMonth("");
    setStartYear("");
    setStartHour("");
    setStartMinute("");
    setDurationHours("");
    setSelectedGun("");
    setStatus("draft");
    setPoints(0);
    setErrors([]);
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Creator Dashboard</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">Creator tools and insights</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-sky-500 to-cyan-400 p-5 text-white shadow-lg ring-1 ring-white/10">
            <div className="absolute -right-10 top-2 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            <p className="text-sm font-semibold uppercase tracking-[0.3em] opacity-80">Creator overview</p>
            <p className="mt-4 text-xl font-bold">Manage campaigns, streams & brand collaborations</p>
            <p className="mt-3 text-sm opacity-90">Level up your creator workflow with interactive campaigns and goal tracking.</p>
          </div>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 p-5 text-white shadow-lg ring-1 ring-white/10">
            <div className="absolute -left-10 bottom-2 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
            <p className="text-sm font-semibold uppercase tracking-[0.3em] opacity-80">Analytics</p>
            <p className="mt-4 text-xl font-bold">View your reach and performance metrics</p>
            <p className="mt-3 text-sm opacity-90">Get instant feedback from your audience and optimize every campaign.</p>
          </div>
        </div>
      </section>

      {/* Create options section */}
      <section className="rounded-3xl bg-gradient-to-br from-purple-50 to-blue-50 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-purple-600">Create New</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">Start creating content</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Create Challenge - shown for both BRAND and STREAMER */}
          <button
            onClick={handleCreateChallengeClick}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 p-5 text-left transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-sky-600 to-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white opacity-90">Create Challenge</p>
                  <p className="mt-2 text-base font-bold text-white">Launch a gamified goal</p>
                </div>
                <svg className="h-6 w-6 text-white opacity-75 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </button>

          {/* Create Ad - shown only for BRAND */}
          {isBrand && (
            <button
              onClick={handleCreateAdClick}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-5 text-left transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white opacity-90">Create Advertisement</p>
                    <p className="mt-2 text-base font-bold text-white">New Ad Campaign</p>
                  </div>
                  <svg className="h-6 w-6 text-white opacity-75 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </button>
          )}

          {/* Empty state for STREAMER when only challenge is available */}
          {isStreamer && (
            <div className="rounded-2xl bg-slate-100 p-5 opacity-50">
              <p className="text-sm font-semibold text-slate-400">Coming Soon</p>
              <p className="mt-2 text-base font-bold text-slate-500">More options available</p>
            </div>
          )}
        </div>
      </section>

      {/* Create Ad Form (shown when user clicks Create Advertisement) */}
      {isBrand && showAdForm && (
        <section className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-slate-900">Create Advertisement</h4>
            <p className="text-sm text-slate-500">Fill the fields below to create a new ad campaign.</p>
          </div>

          {errors.length > 0 && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
              <ul className="list-disc pl-5">
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleAdSubmit} className="grid gap-4 sm:grid-cols-2">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700">Title *</label>
              <input value={adTitle} onChange={(e) => setAdTitle(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Destination URL</label>
              <input value={adUrl} onChange={(e) => setAdUrl(e.target.value)} placeholder="https://..." className="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Call to action</label>
              <input value={adCTA} onChange={(e) => setAdCTA(e.target.value)} placeholder="Play now" className="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700">Image URL</label>
              <input value={adImageUrl} onChange={(e) => setAdImageUrl(e.target.value)} placeholder="https://...jpg" className="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Or upload image</label>
              <input type="file" accept="image/*" onChange={(e) => setAdImageFile(e.target.files?.[0] ?? null)} className="mt-1 w-full" />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700">Description</label>
              <textarea value={adDescription} onChange={(e) => setAdDescription(e.target.value)} rows={4} className="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Start date</label>
              <input type="date" value={adStart} onChange={(e) => setAdStart(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">End date</label>
              <input type="date" value={adEnd} onChange={(e) => setAdEnd(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>

            <div className="col-span-2 flex items-center gap-3 pt-2">
              <button type="submit" className="rounded-lg bg-purple-600 px-4 py-2 text-white">Create Ad</button>
              <button type="button" onClick={handleCancelAd} className="rounded-lg border px-4 py-2">Cancel</button>
            </div>
          </form>
        </section>
      )}

      {showChallengeForm && (
        <section className="rounded-3xl bg-slate-950 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] text-white">
          <div className="mb-4 border-b border-white/10 pb-4">
            <h4 className="text-lg font-semibold">Create New Challenge</h4>
            <p className="mt-2 text-sm text-slate-300">Enter the challenge details that map to your backend challenge schema.</p>
          </div>

          {errors.length > 0 && (
            <div className="mb-4 rounded-2xl bg-red-600/10 p-3 text-sm text-red-100">
              <ul className="list-disc pl-5">
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleChallengeSubmit} className="grid gap-4 sm:grid-cols-2">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-200">Title *</label>
              <input value={challengeTitle} onChange={(e) => setChallengeTitle(e.target.value)} className="mt-1 w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-white" placeholder="Win 3 matches" />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-200">Description *</label>
              <textarea value={challengeDescription} onChange={(e) => setChallengeDescription(e.target.value)} rows={3} className="mt-1 w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-white" placeholder="Describe the challenge and its objectives." />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-200">Game</label>
              <select
                value={gameId}
                onChange={(e) => {
                  const selectedId = Number(e.target.value) as typeof DEFAULT_GAME_ID;
                  setGameId(selectedId);
                  const nextType = GAME_EVENT_TYPE_OPTIONS[selectedId]?.[0]?.value ?? DEFAULT_EVENT_TYPE;
                  setEventType(nextType as ValorantEventType);
                }}
                className="mt-1 w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
              >
                {GAME_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-200">Event type</label>
              <select value={eventType} onChange={(e) => setEventType(e.target.value as ValorantEventType)} className="mt-1 w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-white">
                {availableEventTypes.map((option) => (
                  <option key={option.value} value={option.value as ValorantEventType}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {showGunSelect && (
              <div>
                <label className="block text-sm font-medium text-slate-200">Gun type</label>
                <select value={selectedGun} onChange={(e) => setSelectedGun(e.target.value)} className="mt-1 w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-white">
                  <option value="">Any</option>
                  {availableGuns.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-200">Visibility</label>
              <select value={visibility} onChange={(e) => setVisibility(e.target.value)} className="mt-1 w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-white">
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="unlisted">Unlisted</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200">Reward type</label>
              <select value={rewardType} onChange={(e) => setRewardType(e.target.value)} className="mt-1 w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-white">
                <option value="coins">Coins</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200">Reward value *</label>
              <input value={rewardValue} onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, "");
                setRewardValue(Math.min(Number(val) || 0, 10000).toString());
              }} className="mt-1 w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-white" placeholder="100" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200">Max users *</label>
              <input value={maxUsers} onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, "");
                setMaxUsers(Math.min(Number(val) || 0, 100).toString());
              }} className="mt-1 w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-white" placeholder="10" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200">Target value *</label>
              <input value={targetValue} onChange={(e) => setTargetValue(e.target.value.replace(/[^0-9]/g, ""))} className="mt-1 w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-white" placeholder="5" />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-200">Schedule</label>
              <div className="mt-1 flex flex-wrap gap-2">
                <label className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-white">
                  <input type="radio" name="scheduleType" value="live" checked={scheduleType === "live"} onChange={() => setScheduleType("live")} />
                  Live now
                </label>
                <label className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-white">
                  <input type="radio" name="scheduleType" value="scheduled" checked={scheduleType === "scheduled"} onChange={() => setScheduleType("scheduled")} />
                  Scheduled
                </label>
              </div>
            </div>

            {scheduleType === "scheduled" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-200">Start date *</label>
                  <div className="mt-1 flex gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-2 py-2">
                    <select value={startDay} onChange={(e) => setStartDay(e.target.value)} className="w-1/3 rounded-xl border border-slate-700 bg-slate-900 px-2 py-2 text-white">
                      <option value="">Day</option>
                      {dayOptions.map((day) => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                    <select value={startMonth} onChange={(e) => setStartMonth(e.target.value)} className="w-1/3 rounded-xl border border-slate-700 bg-slate-900 px-2 py-2 text-white">
                      <option value="">Month</option>
                      {monthOptions.map((month) => (
                        <option key={month.value} value={month.value}>{month.label}</option>
                      ))}
                    </select>
                    <select value={startYear} onChange={(e) => setStartYear(e.target.value)} className="w-1/3 rounded-xl border border-slate-700 bg-slate-900 px-2 py-2 text-white">
                      <option value="">Year</option>
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200">Start time *</label>
                  <div className="mt-1 flex gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-2 py-2">
                    <select value={startHour} onChange={(e) => setStartHour(e.target.value)} className="w-1/2 rounded-xl border border-slate-700 bg-slate-900 px-2 py-2 text-white">
                      <option value="">Hour</option>
                      {hourOptions.map((hour) => (
                        <option key={hour} value={hour}>{hour}</option>
                      ))}
                    </select>
                    <select value={startMinute} onChange={(e) => setStartMinute(e.target.value)} className="w-1/2 rounded-xl border border-slate-700 bg-slate-900 px-2 py-2 text-white">
                      <option value="">Minute</option>
                      {minuteOptions.map((minute) => (
                        <option key={minute} value={minute}>{minute}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            ) : (
              <div className="col-span-2 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200">
                Live now will start immediately when the challenge is created.
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-200">Duration (hours) *</label>
              <input value={durationHours} onChange={(e) => setDurationHours(e.target.value.replace(/[^0-9.]/g, ""))} className="mt-1 w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-white" placeholder="2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200">Calculated end</label>
              <input type="text" value={endDateTime ? new Date(endDateTime).toLocaleString() : "Enter schedule details"} readOnly className="mt-1 w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-white" />
            </div>

            <div className="col-span-2 flex flex-wrap items-center gap-3 pt-3">
              <button type="submit" className="rounded-2xl bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">Create Challenge</button>
              <button type="button" onClick={handleCancelChallenge} className="rounded-2xl border border-slate-700 px-5 py-2 text-sm text-slate-200 transition hover:bg-white/5">Cancel</button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
};
