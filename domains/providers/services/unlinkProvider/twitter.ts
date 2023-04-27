import {z} from "zod";
import Account, {IAccount} from "@/models/Account";
import {NotFoundError} from "@/utils/errors";
import {HydratedDocument} from "mongoose";
import ConnectionAccount from "@/models/ConnectionAccount";

export default async function unlinkTwitter(user: Express.User) {
    const account: HydratedDocument<IAccount> | null = await Account.findOne({
        user: user._id,
        provider: "twitter",
    });
    if (!account) {
        throw new NotFoundError("You have not linked this Mastodon account.");
    }
    await ConnectionAccount.deleteMany({
        user: user._id,
        provider: "twitter",
    });
    await account.deleteOne();
}