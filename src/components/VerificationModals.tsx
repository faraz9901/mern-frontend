import { type FormEvent, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

type EmailOtpDialogProps = {
  title: string;
  description: string;
  submitLabel: string;
  defaultEmail?: string;
  onSubmit: (email: string, otp: string) => Promise<void>;
  onCancel: () => void;
};

function EmailOtpDialog({
  title,
  description,
  submitLabel,
  defaultEmail = "",
  onSubmit,
  onCancel,
}: EmailOtpDialogProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setEmail(defaultEmail);
  }, [defaultEmail]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!otp.trim()) {
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(email.trim(), otp.trim());
      setOtp("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-lg space-y-6 rounded-3xl bg-white p-6 shadow-2xl shadow-slate-950"
      >
        <div className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Action required</p>
          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              type="email"
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            6-digit code
            <input
              type="text"
              inputMode="numeric"
              pattern="\\d*"
              maxLength={6}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm tracking-[0.2em] text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
              required
              placeholder="000000"
            />
          </label>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Verifying…" : submitLabel}
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isSubmitting) {
                  onCancel();
                }
              }}
              className="flex-1 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
        <p className="text-xs leading-relaxed text-slate-500">
          Codes expire after a short time. If you did not request this, you can safely close this window.
        </p>
      </div>
    </div>
  );
}

export function VerifyEmailModal() {
  const { redirectEmail, verifyEmail, clearRedirectState } = useAuth((state) => ({
    redirectEmail: state.redirectEmail,
    verifyEmail: state.verifyEmail,
    clearRedirectState: state.clearRedirectState,
  }));

  return (
    <EmailOtpDialog
      title="Verify your email"
      description="Enter the six-digit code we just sent to your inbox so we can confirm it belongs to you."
      submitLabel="Confirm email"
      defaultEmail={redirectEmail ?? ""}
      onSubmit={verifyEmail}
      onCancel={clearRedirectState}
    />
  );
}

export function VerifyTwoFactorModal() {
  const { redirectEmail, verifyTwoFactor, clearRedirectState } = useAuth((state) => ({
    redirectEmail: state.redirectEmail,
    verifyTwoFactor: state.verifyTwoFactor,
    clearRedirectState: state.clearRedirectState,
  }));

  return (
    <EmailOtpDialog
      title="Enter your 2FA code"
      description="We sent a one-time code to your email to finish signing you in."
      submitLabel="Verify and continue"
      defaultEmail={redirectEmail ?? ""}
      onSubmit={verifyTwoFactor}
      onCancel={clearRedirectState}
    />
  );
}

