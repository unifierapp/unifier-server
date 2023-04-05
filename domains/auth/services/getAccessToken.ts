import Account, {IAccount} from "@/models/Account";
import {HydratedDocument} from "mongoose";
import {UnauthorizedError} from "@/utils/errors";
import {urlOrDomainToDomain} from "@/utils/urlHelpers";

export default async function getAccessToken(provider: string, domain?: string) {
    const query: { provider: string, domain?: string } = {provider};
    if (domain) {
        domain = urlOrDomainToDomain(domain);
        query.domain = domain;
    }
    const result: HydratedDocument<IAccount> | null = await Account.findOne(query);
    if (!result) {
        throw new UnauthorizedError("You haven't signed in to this service yet.");
    }
    return result;
}