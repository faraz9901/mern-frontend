import axios, { AxiosError } from "axios";
import type z from "zod";
import { AppConfig } from "../config";

export class BaseService {
    public static validate(schema: z.ZodSchema, data: any) {
        const validated = schema.safeParse(data);
        if (!validated.success) {
            const message = validated.error.issues.map((i) => i.message).join(", ");
            throw new Error(`Validation error: ${message}`);
        }
        return validated.data
    }


    public static api = axios.create({
        baseURL: AppConfig.apiUrl,
        withCredentials: true
    });


    public static getMessage = (error: unknown, fallback: string | undefined = "Something went wrong") => {
        if (error instanceof AxiosError) {
            return error.response?.data?.error || error.response?.data?.message || fallback
        }

        if (error instanceof Error) {
            return error.message
        }

        if (typeof error === "string") {
            return error;
        }

        return fallback
    }
};