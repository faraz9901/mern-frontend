import { type FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { VerifyEmailModal, VerifyTwoFactorModal } from "../components/VerificationModals";

function Login() {
  const login = useAuth((state) => state.login);
  const redirectTo = useAuth((state) => state.redirectTo);
  const user = useAuth((state) => state.user);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (user && !redirectTo) {
      navigate("/", { replace: true });
    }
  }, [user, redirectTo, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.email.trim() || !form.password.trim()) {
      return;
    }
    setIsLoading(true);
    try {
      await login(form.email.trim(), form.password);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-lg space-y-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 text-slate-100 shadow-2xl shadow-slate-900/50">
      <header>
        <p className="text-xs uppercase tracking-[0.5em] text-slate-500">Welcome back</p>
        <h1 className="text-2xl font-semibold text-white">Log in to your account</h1>
        <p className="text-sm text-slate-400">
          Sessions rely on secure cookies and email verification keeps strangers away. Two-factor authentication
          is triggered automatically when the backend requires it.
        </p>
      </header>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-slate-200">
          Email
          <input
            type="email"
            className="mt-1 w-full rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-700"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            required
            autoComplete="email"
          />
        </label>
        <label className="block text-sm font-medium text-slate-200">
          Password
          <input
            type="password"
            className="mt-1 w-full rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-700"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            required
            autoComplete="current-password"
          />
        </label>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.4em] text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="text-xs text-slate-500">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="font-semibold text-white underline-offset-4 hover:underline">
          Create one
        </Link>
        . You will receive a verification code to confirm your email before accessing the dashboard.
      </p>

      {redirectTo === "verify-email" && <VerifyEmailModal />}
      {redirectTo === "verify-2fa" && <VerifyTwoFactorModal />}
    </section>
  );
}

export default Login;