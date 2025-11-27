import { create } from "zustand";
import { AuthService, type RegisterSchema, type User } from "../services/auth.service";
import toast from "react-hot-toast";
import { UserService } from "../services/user.service";


interface AuthState {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (formData: RegisterSchema) => Promise<void>;
    verifyEmail: (email: string, otp: string) => Promise<void>;
    verifyTwoFactor: (email: string, otp: string) => Promise<void>;
    sendVerifyEmail: (email: string) => Promise<void>;
    logout: () => void;
    redirectTo: "verify-email" | "verify-2fa" | null
    redirectEmail: string | null;
    setUser: (user: User | null) => void;
    refreshUser: () => Promise<void>;
    clearRedirectState: () => void;
}


export const useAuth = create<AuthState>((set, get) => ({
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
                set({ redirectTo: "verify-2fa", redirectEmail: email, user: null });
            } else {
                set({ user: data.content, redirectTo: null, redirectEmail: null });
            }

        } catch (error) {
            const errorMessage = AuthService.getMessage(error);
            if (errorMessage.includes("Please verify your email")) {
                await get().sendVerifyEmail(email);
                toast.success("Please check your email to verify your account.");
                set({ redirectTo: "verify-email", redirectEmail: email });
                return
            }
            toast.error(errorMessage)
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
            set({ redirectTo: "verify-email", redirectEmail: formData.email });
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

            set({ user: data.content, redirectTo: null, redirectEmail: null });
        } catch (error) {
            const errorMessage = AuthService.getMessage(error);
            toast.error(errorMessage);
        }
    },
    verifyTwoFactor: async (email: string, otp: string) => {
        try {
            const data = await AuthService.verifyTwoFactor(email, otp);

            if (!data.success) {
                toast.error(data.message);
                return
            }
            toast.success(data.message);

            set({ user: data.content, redirectTo: null, redirectEmail: null });
        } catch (error) {
            const errorMessage = AuthService.getMessage(error);
            toast.error(errorMessage);
        }
    },
    sendVerifyEmail: async (email: string) => {
        try {
            const data = await AuthService.sendVerifyEmail(email);
            if (!data.success) {
                toast.error(data.message);
                return
            }
            toast.success(data.message);
        } catch (error) {
            const errorMessage = AuthService.getMessage(error);
            toast.error(errorMessage);
        }
    },
    logout: async () => {
        await AuthService.logout();
        set({ user: null });
    },
    setUser: (user: User | null) => {
        set({ user });
    },
    refreshUser: async () => {
        try {
            const response = await UserService.getMe();
            if (response.success) {
                set({ user: response.content });
                return;
            }
            set({ user: null });
        } catch (error) {
            set({ user: null });
        }
    },
    clearRedirectState: () => {
        set({ redirectTo: null, redirectEmail: null });
    },
    redirectTo: null,
    redirectEmail: null,
}));
