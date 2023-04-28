import {BadArgumentError} from "@/utils/errors";

export default async function editPassword(user: Express.User, args: {
    oldPassword?: string,
    newPassword: string,
    confirmedPassword: string,
}) {
    const {oldPassword, newPassword, confirmedPassword} = args;
    if (newPassword !== confirmedPassword) {
        throw new BadArgumentError("Confirmed password does not match.");
    }
    if (!user.hash || !user.salt) {
        await user.setPassword(newPassword);
        await user.save();
        return;
    }
    if (!oldPassword) {
        throw new BadArgumentError("Old password must be specified.");
    }
    await user.changePassword(oldPassword, newPassword);
    await user.save();
}
