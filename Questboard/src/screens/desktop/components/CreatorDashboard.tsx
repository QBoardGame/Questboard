import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootReducer } from "app/shared/rootReducer";

export const CreatorDashboard = () => {
  const profile = useSelector((state: RootReducer) => state.profile.data);
  const role = profile?.role?.toUpperCase();
  const isBrand = role === "BRAND";
  const isStreamer = role === "STREAMER";

  const handleCreateChallenge = () => {
    console.log("Create Challenge clicked");
    // Add navigation or modal logic here
  };

  const handleCreateAd = () => {
    // toggle handled via state below
  };

  const [showAdForm, setShowAdForm] = useState(false);
  const [adTitle, setAdTitle] = useState("");
  const [adUrl, setAdUrl] = useState("");
  const [adImageUrl, setAdImageUrl] = useState("");
  const [adImageFile, setAdImageFile] = useState<File | null>(null);
  const [adDescription, setAdDescription] = useState("");
  const [adStart, setAdStart] = useState("");
  const [adEnd, setAdEnd] = useState("");
  const [adCTA, setAdCTA] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const handleCreateAdClick = () => {
    setShowAdForm(true);
  };

  const handleCancelAd = () => {
    setShowAdForm(false);
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

    // reset
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

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Creator Dashboard</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">Creator tools and insights</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Creator overview</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">Manage your campaigns, streams, and brand collaborations.</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Analytics</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">View your reach, performance, and conversion metrics.</p>
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
            onClick={handleCreateChallenge}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 p-5 text-left transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white opacity-90">Create Challenge</p>
                  <p className="mt-2 text-base font-bold text-white">New Challenge</p>
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
    </div>
  );
};
