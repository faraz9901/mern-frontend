import z from "zod";
import { BaseService } from "./base.service";

export class UserService extends BaseService {

    private static updateSchema = z.object({
        firstname: z.string().min(1, "First name is required").optional(),
        lastname: z.string().optional(),
        address: z.string().optional(),
    })

    static async getMe() {
        const { data } = await this.api.get("/api/user/me");
        return data
    }

    static async updateProfile(formData: z.infer<typeof this.updateSchema>) {
        const validated = this.validate(this.updateSchema, formData);

        const { data } = await this.api.put("/api/user/profile", validated);

        return data
    }


    static async enableTwoFactor() {
        const { data } = await this.api.post("/api/user/2fa/enable");
        return data
    }

    static async disableTwoFactor() {
        const { data } = await this.api.post("/api/user/2fa/disable");
        return data
    }

}
