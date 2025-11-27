import { type FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { VerifyEmailModal } from "../components/VerificationModals";

function Register() {
    const register = useAuth((state) => state.register);
    const redirectTo = useAuth((state) => state.redirectTo);
    const user = useAuth((state) => state.user);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        address: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user && !redirectTo) {
            navigate("/", { replace: true });
        }
    }, [user, redirectTo, navigate]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!form.firstname.trim() || !form.email.trim() || !form.password.trim()) {
            return;
        }
        setIsSubmitting(true);
        try {
            await register({
                firstname: form.firstname.trim(),
                lastname: form.lastname.trim() || undefined,
                email: form.email.trim(),
                password: form.password,
                address: form.address.trim() || undefined,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="mx-auto max-w-lg space-y-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 text-slate-100 shadow-2xl shadow-slate-900/50">
            <header>
                <p className="text-xs uppercase tracking-[0.5em] text-slate-500">New account</p>
                <h1 className="text-2xl font-semibold text-white">Create your secure account</h1>
                <p className="text-sm text-slate-400">
                    We will send you a confirmation code right away. Sessions are anchored to cookies and every profile field
                    stays encrypted in the database.
                </p>
            </header>
            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block text-sm font-medium text-slate-200">
                    First name
                    <input
                        className="mt-1 w-full rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-700"
                        value={form.firstname}
                        onChange={(event) => setForm((prev) => ({ ...prev, firstname: event.target.value }))}
                        required
                    />
                </label>
                <label className="block text-sm font-medium text-slate-200">
                    Last name
                    <input
                        className="mt-1 w-full rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-700"
                        value={form.lastname}
                        onChange={(event) => setForm((prev) => ({ ...prev, lastname: event.target.value }))}
                    />
                </label>
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
                        autoComplete="new-password"
                        minLength={8}
                    />
                </label>
                <label className="block text-sm font-medium text-slate-200">
                    Address
                    <input
                        className="mt-1 w-full rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-700"
                        value={form.address}
                        onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
                    />
                </label>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.4em] text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting ? "Creating account…" : "Create account"}
                </button>
            </form>
            <p className="text-xs text-slate-500">
                Already registered?{" "}
                <Link to="/login" className="font-semibold text-white underline-offset-4 hover:underline">
                    Log in
                </Link>
                . After registering you will be redirected to the dashboard to confirm your email before every action.
            </p>


            {redirectTo === "verify-email" && <VerifyEmailModal />}
        </section>
    );
}

export default Register;