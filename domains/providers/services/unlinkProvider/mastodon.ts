import {urlOrDomainToDomain, urlOrDomainToUrl} from "@/utils/urlHelpers";
import {z} from "zod";
import Account, {IAccount} from "@/models/Account";
import {NotFoundError} from "@/utils/errors";
import axios from "axios";
import {HydratedDocument} from "mongoose";
import getMastodonClient from "@/domains/auth/services/getMastodonClient";
import ConnectionAccount from "@/models/ConnectionAccount";

export default async function unlinkMastodon(user: Express.User, options: {
    domain?: string,
}) {
    const domain = urlOrDomainToDomain(z.string().nonempty().parse(options.domain));
    const endpoint = urlOrDomainToUrl(domain);
    const account: HydratedDocument<IAccount> | null = await Account.findOne({
        user: user._id,
        provider: "mastodon",
        domain: domain,
    });
    const client = await getMastodonClient(domain);
    if (!account) {
        throw new NotFoundError("You have not linked this Mastodon account.");
    }
    if (account.internalListId) {
        try {
            await axios.delete(`/api/v1/lists/${account.internalListId}`, {
                baseURL: endpoint,
            })
        } catch (e) {
            console.error(e);
        }
    }
    if (client) {
        try {
            await axios.post("/oauth/revoke", {
                client_id: client.client_id,
                client_secret: client.client_secret,
                token: account.accessToken,
            })
        } catch (e) {
            console.error(e);
        }
    }
    await ConnectionAccount.deleteMany({
        user: user._id,
        provider: "mastodon",
        domain: domain,
    })
    await account.deleteOne();
}