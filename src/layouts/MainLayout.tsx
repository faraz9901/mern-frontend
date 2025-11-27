import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import { AuthService } from "../services/auth.service";

function MainLayout() {
    const { user, logout, clearRedirectState, } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        AuthService.checkSession(navigate, "dashboard");
    }, []);


    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user]);

    const handleLogout = async () => {
        await logout();
        clearRedirectState();
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            {/* HEADER */}
            <header className="border-b border-slate-900/70 bg-slate-950/80 backdrop-blur-sm">
                <div className="
                    mx-auto max-w-6xl
                    flex flex-wrap items-center justify-between 
                    gap-3 px-4 py-3
                ">

                    {/* NAVIGATION */}
                    <nav className="
                        flex flex-wrap items-center gap-2 
                        text-xs sm:text-sm flex-1
                    ">
                        <Link
                            to="/"
                            className="
                                rounded-xl px-3 py-2 
                                text-slate-200 font-medium 
                                transition hover:bg-slate-800 hover:text-white
                            "
                        >
                            Dashboard
                        </Link>

                        <Link
                            to="/edit"
                            className="
                                rounded-xl px-3 py-2 
                                text-slate-200 font-medium 
                                transition hover:bg-slate-800 hover:text-white
                            "
                        >
                            Edit profile
                        </Link>
                    </nav>

                    {/* AUTH / USER SECTION */}
                    <div className="
                        flex flex-wrap items-center justify-end 
                        gap-2 text-xs sm:text-sm max-w-full
                    ">
                        {user ? (
                            <>
                                {/* 2FA badge */}
                                <span className="
                                    rounded-full border border-slate-800 
                                    px-2.5 py-1 text-[10px] sm:text-xs 
                                    uppercase tracking-widest text-slate-300
                                ">
                                    {user.twoFactorEnabled ? "2FA On" : "2FA Off"}
                                </span>

                                {/* Email */}
                                <span className="
                                    truncate max-w-[110px] sm:max-w-xs
                                    rounded-full bg-slate-900/60
                                    px-2.5 py-1 text-[10px] sm:text-xs
                                ">
                                    {user.email}
                                </span>

                                {/* Logout */}
                                <button
                                    onClick={handleLogout}
                                    className="
                                        rounded-xl border border-slate-700 
                                        px-3 py-1 text-[10px] sm:text-xs 
                                        font-semibold uppercase tracking-wide 
                                        text-slate-200 transition 
                                        hover:bg-slate-800
                                    "
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="
                                        rounded-xl border border-slate-700 
                                        px-3 py-1 text-[10px] sm:text-xs 
                                        font-semibold uppercase tracking-wide 
                                        text-slate-200 transition 
                                        hover:border-slate-500
                                    "
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="
                                        rounded-xl bg-slate-800 px-3 py-1 
                                        text-[10px] sm:text-xs font-semibold 
                                        uppercase tracking-wide 
                                        text-slate-200 transition hover:bg-slate-700
                                    "
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
                <Outlet />
            </main>
        </div>
    );
}

export default MainLayout;
