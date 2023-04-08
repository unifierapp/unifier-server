import {urlOrDomainToDomain, urlOrDomainToUrl} from "@/utils/urlHelpers";
import axios from "axios";
import getAccount from "@/domains/auth/services/getAccount";
import {NotFoundError} from "@/utils/errors";

export default async function addProfileToMastodonList(user: Express.User, params: { domain?: string, accountIds: string[] }) {
    if (!params.domain) {
        throw new NotFoundError("You need to specify a domain.");
    }
    let domain = urlOrDomainToDomain(params.domain);
    const account = await getAccount(user, {provider: "mastodon", domain});
    const endpoint = urlOrDomainToUrl(params.domain);
    await axios.post(`/api/v1/lists/${account.internalListId}/accounts`, {
        account_ids: params.accountIds,
    }, {
        headers: {
            Authorization: `Bearer ${account.accessToken}`,
        },
        baseURL: endpoint,
    });
}
