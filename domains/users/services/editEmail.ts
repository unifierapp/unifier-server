import crypto from "crypto";
import {sendConfirmEmail} from "@/domains/auth/services/sendConfirmEmail";

export default async function editEmail(user: Express.User, newEmail: string) {
    user.newEmail = newEmail;
    user.emailConfirmationKey = crypto.randomBytes(32).toString("hex");
    await user.save();
    return user.emailConfirmationKey;
}
