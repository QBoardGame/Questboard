import { FormEvent, useState } from "react";
import "./LoginPage.css";

type SignupPageProps = {
  onGoogleSignup: () => void;
  onSwitchMode: () => void;
  onRegister: (credentials: {
    username: string;
    email: string;
    password: string;
    authType: string;
  }) => Promise<void>;
};

export const SignupPage = ({
  onGoogleSignup,
  onSwitchMode,
  onRegister,
}: SignupPageProps) => {
  const [username, setUsername] = useState("");
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
      await onRegister({ username, email, password, authType });
    } catch (err) {
      setError(
        "Unable to create your account. Please check your details and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <header className="login-header">
          <h1>Create your account</h1>
          <p className="login-subtitle">
            Register with your details or continue with Google to get started.
          </p>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              className="form-input"
              placeholder="Choose your username"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="form-input"
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="form-input"
              placeholder="••••••••"
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <div className="divider-container">
          <div className="divider-line" />
          <span className="divider-text">Or</span>
          <div className="divider-line" />
        </div>

        <button className="google-button" onClick={onGoogleSignup}>
          <svg
            className="google-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <footer className="login-footer">
          <p className="footer-text">
            Already have an account?
            <button
              type="button"
              className="signup-link"
              onClick={onSwitchMode}
            >
              Sign in
            </button>
          </p>
        </footer>
      </div>
    </div>
  );
};
