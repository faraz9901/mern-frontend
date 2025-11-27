import { type FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { VerifyEmailModal } from "../components/VerificationModals";
import { AuthService } from "../services/auth.service";

function Register() {
    const { register, redirectTo, user } = useAuth();
    const [form, setForm] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        address: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        AuthService.checkSession(navigate, "register");
    }, []);

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, []);

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
        <div className="min-h-screen  bg-slate-900 flex flex-col items-center justify-center">
            <section
                className="mx-auto w-full lg:min-w-xl max-w-md space-y-6 rounded-2xl border border-slate-800  bg-slate-700  p-4 text-slate-100 shadow-2xl shadow-slate-900/50 sm:rounded-3xl sm:p-6 "
            >
                <header className="space-y-1">
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-slate-500">
                        New account
                    </p>

                    <h1 className="text-xl sm:text-2xl font-semibold text-white">
                        Create your secure account
                    </h1>

                    <p className="text-xs sm:text-sm text-slate-400">
                        We will send you a confirmation code right away.
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="block text-xs sm:text-sm font-medium text-slate-200">
                        First name
                        <input
                            className="
                    mt-1 w-full rounded-xl 
                    border border-slate-800 
                    bg-slate-950/70 
                    px-3 py-2 
                    text-sm text-white 
                    outline-none transition 
                    focus:border-slate-500 
                    focus:ring-2 focus:ring-slate-700
                "
                            value={form.firstname}
                            onChange={(e) => setForm(prev => ({ ...prev, firstname: e.target.value }))}
                            required
                        />
                    </label>

                    <label className="block text-xs sm:text-sm font-medium text-slate-200">
                        Last name
                        <input
                            className="
                    mt-1 w-full rounded-xl 
                    border border-slate-800 
                    bg-slate-950/70 
                    px-3 py-2 
                    text-sm text-white 
                    outline-none transition 
                    focus:border-slate-500 
                    focus:ring-2 focus:ring-slate-700
                "
                            value={form.lastname}
                            onChange={(e) => setForm(prev => ({ ...prev, lastname: e.target.value }))}
                        />
                    </label>

                    <label className="block text-xs sm:text-sm font-medium text-slate-200">
                        Email
                        <input
                            type="email"
                            className="
                    mt-1 w-full rounded-xl 
                    border border-slate-800 
                    bg-slate-950/70 
                    px-3 py-2 
                    text-sm text-white 
                    outline-none transition 
                    focus:border-slate-500 
                    focus:ring-2 focus:ring-slate-700
                "
                            value={form.email}
                            onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                            required
                            autoComplete="email"
                        />
                    </label>

                    <label className="block text-xs sm:text-sm font-medium text-slate-200">
                        Password
                        <input
                            type="password"
                            className="
                    mt-1 w-full rounded-xl 
                    border border-slate-800 
                    bg-slate-950/70 
                    px-3 py-2 
                    text-sm text-white 
                    outline-none transition 
                    focus:border-slate-500 
                    focus:ring-2 focus:ring-slate-700
                "
                            value={form.password}
                            onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                            required
                            minLength={8}
                            autoComplete="new-password"
                        />
                    </label>

                    <label className="block text-xs sm:text-sm font-medium text-slate-200">
                        Address
                        <input
                            className="
                    mt-1 w-full rounded-xl 
                    border border-slate-800 
                    bg-slate-950/70 
                    px-3 py-2 
                    text-sm text-white 
                    outline-none transition 
                    focus:border-slate-500 
                    focus:ring-2 focus:ring-slate-700
                "
                            value={form.address}
                            onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="
                w-full rounded-xl 
                bg-slate-100 px-4 py-2 
                text-xs sm:text-sm font-semibold 
                uppercase tracking-[0.3em] 
                text-slate-900 
                transition 
                hover:bg-slate-200 
                disabled:cursor-not-allowed 
                disabled:opacity-60
            "
                    >
                        {isSubmitting ? "Creating…" : "Create account"}
                    </button>
                </form>

                <p className="text-xs text-slate-500 text-center">
                    Already registered?{" "}
                    <Link to="/login" className="font-semibold text-white underline-offset-4 hover:underline">
                        Log in
                    </Link>
                </p>

                {redirectTo === "verify-email" && <VerifyEmailModal />}
            </section>
        </div>
    );
}

export default Register;