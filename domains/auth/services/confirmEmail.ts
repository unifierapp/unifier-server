import User, {IUser} from "@/models/User";
import {UnauthorizedError} from "@/utils/errors";

export default async function confirmEmail(token: string) {
    const user: IUser|null = await User.findOne({
        emailConfirmationKey: token,
    });
    if (!user) {
        throw new UnauthorizedError("This email confirmation token is invalid.");
    }
    user.email = user.newEmail;
    user.emailVerified = true;
    delete user.emailConfirmationKey;
    await user.save();
}
