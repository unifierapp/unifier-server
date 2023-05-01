import axios from "axios";
import getAccount from "@/domains/auth/services/getAccount";
import {z} from "zod";
import {UnauthorizedError} from "@/utils/errors";

export default async function addProfileToMastodonList(user: Express.User, params: { endpoint?: string, accountIds: string[] }) {
    const endpoint = z.string().nonempty().parse(params.endpoint);
    const account = await getAccount(user, {provider: "mastodon", endpoint: params.endpoint});
    if (!account) {
        throw new UnauthorizedError("You have not signed in to this service yet.");
    }
    await axios.post(`/api/v1/lists/${account.internalListId}/accounts`, {
        account_ids: params.accountIds,
    }, {
        headers: {
            Authorization: `Bearer ${account.accessToken}`,
        },
        baseURL: endpoint,
    });
}
