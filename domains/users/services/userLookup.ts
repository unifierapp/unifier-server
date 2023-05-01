import User, {IUser} from "@/models/User";
import {NotFoundError} from "@/utils/errors";

export default async function userLookup(username: string) {
    const user: IUser|null = await User.findOne({
        username: username
    });
    if (!user) {
        throw new NotFoundError("User not found.");
    }
    return user;
}
