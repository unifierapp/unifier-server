import {urlOrDomainToUrl, urlOrDomainToDomain} from "@/utils/urlHelpers";
import axios from "axios";
import getAccessToken from "@/domains/auth/services/getAccessToken";
import {NotFoundError} from "@/utils/errors";
import {SearchedAccount} from "./index";

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

export default async function searchMastodonAccount(info: {
    username: string,
    domain?: string,
}): Promise<SearchedAccount[]> {
    if (!info.domain) {
        throw new NotFoundError("Domain not specified.");
    }
    const endpoint = urlOrDomainToUrl(info.domain);
    const domain = urlOrDomainToDomain(info.domain);
    const accessToken = await getAccessToken("mastodon", info.domain);
    const result = await axios.get<MastodonAccount[]>("/api/v1/accounts/search", {
        params: {
            q: info.username,
            limit: 10,
        },
        headers: {
            Authorization: `Bearer ${accessToken.accessToken}`
        },
        baseURL: endpoint,
    });
    return result.data.map((acc): SearchedAccount => {
        return {
            providerId: acc.id,
            providerHandle: `${acc.username}@${domain}`,
            providerDisplayName: acc.display_name,
            providerProfilePictureUrl: acc.avatar_static,
        }
    });
}