import {HydratedDocument} from "mongoose";
import Account, {IAccount} from "@/models/Account";
import {NotFoundError} from "@/utils/errors";
import ConnectionAccount from "@/models/ConnectionAccount";

export default async function unlinkInstagram(user: Express.User) {
    const account: HydratedDocument<IAccount> | null = await Account.findOne({
        user: user._id,
        provider: "instagram",
    });
    if (!account) {
        throw new NotFoundError("You have not linked this Mastodon account.");
    }
    await account.deleteOne();
}