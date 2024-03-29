import getAccount from "@/domains/auth/services/getAccount";
import createMastodonList from "@/domains/providers/services/getOrCreateProviderList/mastodon";
import {NotFoundError, UnauthorizedError} from "@/utils/errors";

export default async function getOrCreateProviderList(user: Express.User, props: {
    provider: string,
    endpoint?: string,
}): Promise<string> {
    const account = await getAccount(user, props);
    if (!account) {
        throw new UnauthorizedError("You have not signed in to this service yet.");
    }
    if (account.internalListId) {
        return account.internalListId;
    }
    const mapping: Record<string, (accessToken: string, endpoint?: string) => Promise<string>> = {
        mastodon: createMastodonList,
    }
    const func = mapping[props.provider];
    if (!func) {
        throw new NotFoundError("No provider found.");
    }
    const output = await func(account.accessToken, props.endpoint);
    account.internalListId = output;
    await account.save();
    return output;
}
