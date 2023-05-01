import {urlOrDomainToDomain} from "@/utils/urlHelpers";
import axios from "axios";
import getAccount from "@/domains/auth/services/getAccount";
import {SearchedAccount} from "./index";
import {z} from "zod";
import {UnauthorizedError} from "@/utils/errors";

interface MastodonAccount {
    id: string;
    username: string;
    acct: string;
    display_name: string;
    note: string;
    url: string;
    avatar: string;
    avatar_static: string;
    header: string;
    header_static: string;
    followers_count: number;
    following_count: number;
    statuses_count: number;
}

export default async function searchMastodonAccount(user: Express.User, info: {
    username: string,
    endpoint?: string,
}): Promise<SearchedAccount[]> {
    const endpoint = z.string().nonempty().parse(info.endpoint);
    const account = await getAccount(user, {
        provider: "mastodon",
        endpoint: endpoint,
    });
    if (!account) {
        throw new UnauthorizedError("You haven't signed in to this service yet.");
    }
    const result = await axios.get<MastodonAccount[]>("/api/v1/accounts/search", {
        params: {
            q: info.username,
            limit: 10,
        },
        headers: {
            Authorization: `Bearer ${account.accessToken}`
        },
        baseURL: endpoint,
    });
    return result.data.map((acc): SearchedAccount => {
        return {
            providerId: acc.id,
            providerHandle: `${acc.username}@${urlOrDomainToDomain(endpoint)}`,
            providerDisplayName: acc.display_name,
            providerProfilePictureUrl: acc.avatar_static,
        }
    });
}