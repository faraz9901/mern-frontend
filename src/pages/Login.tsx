import { type FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { VerifyEmailModal, VerifyTwoFactorModal } from "../components/VerificationModals";
import { AuthService } from "../services/auth.service";

function Login() {
  const { login, user, redirectTo } = useAuth()

  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    AuthService.checkSession(navigate, "login");
  }, []);

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.email.trim() || !form.password.trim()) return;

    setIsLoading(true);
    try {
      await login(form.email.trim(), form.password);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-900 flex flex-col items-center justify-center">
      <section
        className="
        mx-auto 
        lg:min-w-xl
        max-w-sm sm:max-w-md md:max-w-lg 
        space-y-6 
        rounded-3xl 
        border border-slate-800 
        bg-slate-700 
        p-4 md:p-6 
        text-slate-100 
        shadow-2xl shadow-slate-900/50
        mt-8
      "
      >
        <header>
          <p className="text-xs uppercase tracking-[0.5em] text-slate-500">
            Welcome back
          </p>

          <h1 className="text-xl sm:text-2xl font-semibold text-white">
            Log in to your account
          </h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-200">
            Email
            <input
              type="email"
              className="
              mt-1 w-full 
              rounded-2xl 
              border border-slate-800 
              bg-slate-950/70 
              px-3 py-2 sm:py-3 
              text-sm text-white 
              outline-none 
              transition 
              focus:border-slate-500 
              focus:ring-2 focus:ring-slate-700
            "
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              required
              autoComplete="email"
            />
          </label>

          <label className="block text-sm font-medium text-slate-200">
            Password
            <input
              type="password"
              className="
              mt-1 w-full 
              rounded-2xl 
              border border-slate-800 
              bg-slate-950/70 
              px-3 py-2 sm:py-3
              text-sm text-white 
              outline-none 
              transition 
              focus:border-slate-500 
              focus:ring-2 focus:ring-slate-700
            "
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              required
              autoComplete="current-password"
            />
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="
            w-full 
            rounded-2xl 
            bg-slate-100 
            px-4 py-2 sm:py-3 
            text-sm font-semibold 
            uppercase tracking-[0.4em] 
            text-slate-900 
            transition 
            hover:bg-slate-200 
            disabled:cursor-not-allowed 
            disabled:opacity-60
          "
          >
            {isLoading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-xs text-slate-500 text-center">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-white underline-offset-4 hover:underline"
          >
            Create one
          </Link>
        </p>

        {redirectTo === "verify-email" && <VerifyEmailModal />}
        {redirectTo === "verify-2fa" && <VerifyTwoFactorModal />}
      </section>
    </div>
  );
}

export default Login;
