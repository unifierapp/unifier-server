import {IUser} from "@/models/User";
import Account, {IAccount} from "@/models/Account";
import {HydratedDocument} from "mongoose";

export default async function userAccountLookup(user: IUser): Promise<HydratedDocument<IAccount>[]> {
    return Account.find({
        user: user._id
    });
}
