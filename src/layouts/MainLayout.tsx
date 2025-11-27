import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function MainLayout() {
    const user = useAuth((state) => state.user);
    const logout = useAuth((state) => state.logout);
    const clearRedirectState = useAuth((state) => state.clearRedirectState);


    const handleLogout = async () => {
        await logout();
        clearRedirectState();
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <header className="border-b border-slate-900/70 bg-slate-950/80 backdrop-blur-sm">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
                    <div>
                        <Link to="/" className="text-lg font-semibold text-white">
                            Secure MERN
                        </Link>
                        <p className="text-xs text-slate-400">Session-backed, encrypted profiles</p>
                    </div>
                    <nav className="flex flex-1 items-center gap-3 text-sm">
                        <Link
                            to="/"
                            className="rounded-2xl px-4 py-2 font-medium text-slate-200 transition hover:bg-slate-800 hover:text-white"
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/edit"
                            className="rounded-2xl px-4 py-2 font-medium text-slate-200 transition hover:bg-slate-800 hover:text-white"
                        >
                            Edit profile
                        </Link>
                    </nav>
                    <div className="flex items-center gap-3 text-sm">
                        {user ? (
                            <>
                                <span className="rounded-full border border-slate-800 px-3 py-1 text-xs uppercase tracking-widest text-slate-300">
                                    {user.twoFactorEnabled ? "2FA On" : "2FA Off"}
                                </span>
                                <span className="truncate rounded-full bg-slate-900/60 px-3 py-1 text-xs">{user.email}</span>
                                <button
                                    onClick={handleLogout}
                                    className="rounded-2xl border border-slate-700 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200 transition hover:bg-slate-800"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="rounded-2xl border border-slate-700 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200 transition hover:border-slate-500"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="rounded-2xl bg-slate-800 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200 transition hover:bg-slate-700"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-10">
                <Outlet />
            </main>
        </div>
    );
}

export default MainLayout;