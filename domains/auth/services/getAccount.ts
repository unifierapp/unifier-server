import Account, {IAccount} from "@/models/Account";
import mongoose, {HydratedDocument} from "mongoose";
import {UnauthorizedError} from "@/utils/errors";

export default async function getAccount(user: Express.User, props: {
    provider: string, endpoint?: string
}) {
    const query: { provider: string, endpoint?: string, user: mongoose.Types.ObjectId } = {
        provider: props.provider,
        user: user._id
    };
    if (props.endpoint) {
        query.endpoint = props.endpoint;
    }
    const result: HydratedDocument<IAccount> | null = await Account.findOne(query);
    return result;
}