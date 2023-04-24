import searchMastodonAccount from "@/domains/providers/services/searchProviderAccount/mastodon";
import {NotFoundError} from "@/utils/errors";

export interface SearchedAccount {
    providerId: string,
    providerHandle: string,
    providerDisplayName: string,
    providerProfilePictureUrl: string,
}

export default async function searchProviderAccount(user: Express.User, provider: string, info: {
    username: string,
    endpoint?: string,
}): Promise<SearchedAccount[]> {
    const mapping: Record<string, (user: Express.User, props: { username: string, endpoint?: string }) => Promise<SearchedAccount[]>> = {
        mastodon: searchMastodonAccount
    };
    const func = mapping[provider];
    if (!func) {
        throw new NotFoundError("Your account provider does not exist.");
    }
    return await func(user, info);
}