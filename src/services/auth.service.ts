import z from "zod";
import { BaseService } from "./base.service";
import type { Response } from "../types";

export interface User {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    address: string;
    lastLoginAt: Date;
    createdAt: Date;
    twoFactorEnabled: boolean;
    updatedAt: Date;
    emailVerified: boolean;
}

const passwordValidation = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Za-z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number")

const otpValidation = z.string().length(6, "OTP must be 6 digits").regex(/^\d+$/, "OTP must contain only digits")

const otpMailSchema = z.object({
    email: z.email("Invalid email address"),
    otp: otpValidation,
})

const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: passwordValidation,
})

const registerSchema = z.object({
    firstname: z.string().min(1, "First name is required"),
    lastname: z.string().optional(),
    email: z.email("Invalid email address"),
    password: passwordValidation,
    address: z.string().optional(),
})


export type RegisterSchema = z.infer<typeof registerSchema>


export class AuthService extends BaseService {


    static async login(email: string, password: string): Promise<Response<User>> {
        const validated = this.validate(loginSchema, { email, password });

        const { data } = await this.api.post("/api/auth/login", validated);

        return data
    }

    static async register(formData: z.infer<typeof registerSchema>): Promise<Response<null>> {
        const validated = this.validate(registerSchema, formData);

        const { data } = await this.api.post("/api/auth/register", validated);

        return data
    }


    static async verifyEmail(email: string, otp: string) {
        const validated = this.validate(otpMailSchema, { email, otp });

        const { data } = await this.api.post("/api/auth/verify-email", validated);

        return data
    }

    static async verifyTwoFactor(email: string, otp: string) {
        const validated = this.validate(otpMailSchema, { email, otp });

        const { data } = await this.api.post("/api/auth/verify-2fa", validated);

        return data
    }


    static async logout() {
        await this.api.post("/api/auth/logout");
    }
}
