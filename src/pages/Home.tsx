import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { UserService } from "../services/user.service";

const formatDate = (value?: string | Date) => {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, { hour12: true });
};

function Home() {
  const user = useAuth((state) => state.user);
  const refreshUser = useAuth((state) => state.refreshUser);
  const [processingTwoFactor, setProcessingTwoFactor] = useState(false);

  const handleTwoFactorToggle = async () => {
    if (!user) {
      toast.error("Log in to manage two-factor authentication.");
      return;
    }

    setProcessingTwoFactor(true);
    try {
      const action = user.twoFactorEnabled
        ? UserService.disableTwoFactor
        : UserService.enableTwoFactor;
      const response = await action();
      if (response.success) {
        toast.success(response.message);
        await refreshUser();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(UserService.getMessage(error));
    } finally {
      setProcessingTwoFactor(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <section className="space-y-8">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.5em] text-slate-500">Secure dashboard</p>
        <h1 className="text-3xl font-semibold text-white">Account overview</h1>
        <p className="text-sm text-slate-400">
          Sessions stay on the server, user data is encrypted at rest, and every sensitive action is gated
          by email verification.
        </p>
      </header>


      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-slate-950/40">
          <div className="flex items-center justify-between">
            <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Profile data</p>
            <span className="rounded-full bg-slate-800/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-slate-200">
              {user.emailVerified ? "Email verified" : "Email pending"}
            </span>
          </div>
          <div className="mt-5 space-y-4 text-sm text-slate-300">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-500">Name</p>
              <p className="text-lg font-semibold text-white">{`${user.firstname} ${user.lastname || ""}`.trim() || "Not set"}</p>
            </div>
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-500">Email</p>
              <p className="text-lg font-semibold text-white">{user.email}</p>
            </div>
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-500">Address</p>
              <p className="text-lg font-semibold text-white">{user.address || "Not provided"}</p>
            </div>
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-500">Registered</p>
              <p className="text-lg font-semibold text-white">{formatDate(user.createdAt)}</p>
            </div>
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-500">Last login</p>
              <p className="text-lg font-semibold text-white">{formatDate(user.lastLoginAt)}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-900/30 p-6 shadow-2xl shadow-slate-950/40">
          <div className="flex items-center justify-between">
            <p className="text-sm uppercase tracking-[0.4em] text-slate-300">Two-factor</p>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${user.twoFactorEnabled
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-amber-500/20 text-amber-200"
                }`}
            >
              {user.twoFactorEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>
          <p className="mt-3 text-sm text-slate-200">
            Every login is protected by an email OTP. You can toggle the requirement below without touching the
            backend.
          </p>
          <button
            onClick={handleTwoFactorToggle}
            disabled={processingTwoFactor}
            className="mt-5 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {processingTwoFactor
              ? "Updating…"
              : user.twoFactorEnabled
                ? "Disable email 2FA"
                : "Enable email 2FA"}
          </button>
          <Link
            to="/edit"
            className="mt-4 inline-block text-sm font-semibold text-slate-200 underline-offset-4 hover:text-white"
          >
            Update profile
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Session security</p>
          <p className="mt-3 text-sm text-slate-300">
            Every request is backed by a server-side session stored in an HTTP-only cookie. Idle sessions are invalidated
            automatically to prevent hijacking.
          </p>
          <ul className="mt-4 space-y-2 text-xs text-slate-400">
            <li>• Cookies are Secure / SameSite=strict</li>
            <li>• Sessions rotate on login</li>
            <li>• CSRF protection enforced on the backend</li>
          </ul>
        </article>
        <article className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Data protection</p>
          <p className="mt-3 text-sm text-slate-300">
            Your profile fields are encrypted before being saved so only the API can read them. This includes names,
            email, and address details.
          </p>
          <p className="mt-3 text-xs uppercase tracking-[0.3em] text-slate-500">Encryption at rest</p>
          <p className="text-sm text-slate-400">
            Keys are rotated regularly and never leave the server. You always control when this information is refreshed.
          </p>
        </article>
      </div>
    </section>
  );
}

export default Home;