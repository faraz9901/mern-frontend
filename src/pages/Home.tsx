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
  const { user, refreshUser } = useAuth();
  const [processingTwoFactor, setProcessingTwoFactor] = useState(false);

  const handleTwoFactorToggle = async () => {
    if (!user) {
      toast.error("Log in to manage two-factor authentication.");
      return;
    }

    setProcessingTwoFactor(true);
    try {
      const action = user.twoFactorEnabled
        ? UserService.disableTwoFactor.bind(UserService)
        : UserService.enableTwoFactor.bind(UserService);

      const response = await action();
      if (response.success) {
        toast.success(response.message);
        await refreshUser();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error)
      toast.error(UserService.getMessage(error));
    } finally {
      setProcessingTwoFactor(false);
    }
  };

  if (!user) return null;

  return (
    <section className="space-y-6 md:space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-semibold text-white">
          Account overview
        </h1>
      </header>

      {/* Responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile section */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4 md:p-6 shadow-xl shadow-slate-950/40">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm uppercase tracking-[0.4em] text-slate-500">
              Profile data
            </p>
            <span className="rounded-full bg-slate-800/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200">
              {user.emailVerified ? "Email verified" : "Email pending"}
            </span>
          </div>

          <div className="mt-5 space-y-4 text-sm text-slate-300">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-500">Name</p>
              <p className="text-lg font-semibold text-white">
                {`${user.firstname} ${user.lastname || ""}`.trim() || "Not set"}
              </p>
            </div>

            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-500">Email</p>
              <p className="text-lg font-semibold text-white break-all">{user.email}</p>
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

        {/* Two-factor section */}
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-900/30 p-4 md:p-6 shadow-2xl shadow-slate-950/40">
          <div className="flex flex-wrap items-center justify-between gap-2">
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
            Every login is protected by an email OTP. You can toggle the requirement below.
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
    </section>
  );
}

export default Home;
