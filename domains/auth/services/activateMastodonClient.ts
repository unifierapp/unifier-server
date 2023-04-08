import FederatedClient from "@/models/FederatedClient";
import {mastodonStrategy} from "@/domains/auth/strategies/mastodon";
import axios from "axios";
import {urlOrDomainToDomain} from "@/utils/urlHelpers";

function getUrlFromDomain(urlOrDomain: string) {
    try {
        return new URL(urlOrDomain).toString()
    } catch (e) {
        return `https://${urlOrDomain}`
    }
}

interface RawMastodonClient {
    id: string;
    name: string;
    website: string | null;
    redirect_uri: string;
    client_id: string;
    client_secret: string;
    vapid_key: string;
}

export default async function activateMastodonClient(domain: string, redirectUrl: string): Promise<void> {
    try {
        mastodonStrategy.getClient(domain);
        return;
    } catch (e) {
    }
    domain = urlOrDomainToDomain(domain);
    let lookup = await FederatedClient.findOne({
        domain: domain,
        redirect_url: redirectUrl
    });
    if (lookup) {
        const newClient = {
            client_id: lookup.client_id,
            client_secret: lookup.client_secret,
            url: lookup.domain,
            redirect_url: lookup.redirect_url,
        }
        mastodonStrategy.addClient(newClient);
        return;
    }
    const endpoint = getUrlFromDomain(domain);
    const data = (await axios.post<RawMastodonClient>("/api/v1/apps", {
        client_name: "Converge",
        website: "https://converge.app",
        scopes: ["read", "write", "follow", "push"].join(" "),
        redirect_uris: redirectUrl
    }, {
        baseURL: endpoint
    })).data;
    await new FederatedClient({
        domain: domain,
        client_secret: data.client_secret,
        client_id: data.client_id,
        redirect_url: data.redirect_uri,
        provider: "mastodon",
    }).save()
    const newClient = {
        client_id: data.client_id,
        client_secret: data.client_secret,
        url: domain,
        redirect_url: data.redirect_uri,
    }
    mastodonStrategy.addClient(newClient);
    return;
}