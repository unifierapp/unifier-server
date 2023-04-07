import Account, {IAccount} from "@/models/Account";
import mongoose, {HydratedDocument} from "mongoose";
import {UnauthorizedError} from "@/utils/errors";
import {urlOrDomainToDomain} from "@/utils/urlHelpers";

export default async function getAccount(user: Express.User, props: {
    provider: string, domain?: string
}) {
    const query: { provider: string, domain?: string, user: mongoose.Types.ObjectId } = {
        provider: props.provider,
        user: user._id
    };
    if (props.domain) {
        query.domain = urlOrDomainToDomain(props.domain);
    }
    const result: HydratedDocument<IAccount> | null = await Account.findOne(query);
    if (!result) {
        throw new UnauthorizedError("You haven't signed in to this service yet.");
    }
    return result;
}