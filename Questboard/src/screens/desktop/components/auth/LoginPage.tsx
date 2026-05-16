import { FormEvent, useState } from "react";
import { Title } from "components/Title/Title";

type LoginPageProps = {
  onGoogleLogin: () => void;
  onSwitchMode: () => void;
  onLogin: (credentials: { email: string; password: string; authType: string }) => Promise<void>;
};

export const LoginPage = ({ onGoogleLogin, onSwitchMode, onLogin }: LoginPageProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const authType = "EMAIL";
      await onLogin({ email, password, authType});
    } catch (err) {
      setError("Unable to sign in. Please check your credentials and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-[32px] bg-white/95 p-10 shadow-[0_20px_60px_rgba(0,0,0,0.15)] backdrop-blur-sm">
      <header className="mb-8">
        <Title color="black">Welcome back</Title>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          Sign in with your email, password, or your Google account to access the Questboard dashboard.
        </p>
      </header>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block text-sm font-semibold text-slate-900">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            placeholder="you@example.com"
          />
        </label>

        <label className="block text-sm font-semibold text-slate-900">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            placeholder="••••••••"
          />
        </label>

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-center text-sm text-slate-500">
        <span className="border-t border-slate-200 px-3">OR</span>
      </div>

      <button
        className="mt-6 w-full rounded-full bg-[#4285f4] px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-blue-600"
        onClick={onGoogleLogin}
      >
        Continue with Google
      </button>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-700">
        <span>Don’t have an account yet?</span>
        <button type="button" className="font-semibold text-sky-600 hover:text-sky-700" onClick={onSwitchMode}>
          Go to Sign up
        </button>
      </div>
    </div>
  );
};
