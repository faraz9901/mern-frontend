import { create } from "zustand";
import { AuthService, type RegisterSchema, type User } from "../services/auth.service";
import toast from "react-hot-toast";


interface AuthState {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (formData: RegisterSchema) => Promise<void>;
    verifyEmail: (email: string, otp: string) => Promise<void>;
    verfiyTwoFactor: (email: string, otp: string) => Promise<void>;
    logout: () => void;
    redirectTo: "verify-email" | "verify-2fa" | null
}


export const useAuth = create<AuthState>((set) => ({
    user: null,
    login: async (email: string, password: string) => {
        try {
            const data = await AuthService.login(email, password);
            if (!data.success) {
                toast.error(data.message);
                return
            }

            const user = data.content;

            toast.success(data.message);

            if (user.twoFactorEnabled) {
                set({ redirectTo: "verify-2fa" });
            } else {
                set({ user: data.content });
            }

        } catch (error) {
            const errorMessage = AuthService.getMessage(error);
            toast.error(errorMessage);
        }
    },
    register: async (formData: RegisterSchema) => {
        try {
            const data = await AuthService.register(formData);
            if (!data.success) {
                toast.error(data.message);
                return
            }
            toast.success(data.message);
            set({ redirectTo: "verify-email" });
        } catch (error) {
            const errorMessage = AuthService.getMessage(error);
            toast.error(errorMessage);
        }
    },
    verifyEmail: async (email: string, otp: string) => {
        try {
            const data = await AuthService.verifyEmail(email, otp);

            if (!data.success) {
                toast.error(data.message);
                return
            }
            toast.success(data.message);

            set({ user: data.content, redirectTo: null });
        } catch (error) {
            const errorMessage = AuthService.getMessage(error);
            toast.error(errorMessage);
        }
    },
    verfiyTwoFactor: async (email: string, otp: string) => {
        try {
            const data = await AuthService.verfiyTwoFactor(email, otp);

            if (!data.success) {
                toast.error(data.message);
                return
            }
            toast.success(data.message);

            set({ user: data.content, redirectTo: null });
        } catch (error) {
            const errorMessage = AuthService.getMessage(error);
            toast.error(errorMessage);
        }
    },
    logout: async () => {
        await AuthService.logout();
        set({ user: null });
    },
    redirectTo: null
}));
