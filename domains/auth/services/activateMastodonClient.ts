import FederatedClient from "@/models/FederatedClient";
import {mastodonStrategy} from "@/domains/auth/strategies/mastodon";
import axios from "axios";

interface RawMastodonClient {
    id: string;
    name: string;
    website: string | null;
    redirect_uri: string;
    client_id: string;
    client_secret: string;
    vapid_key: string;
}

export default async function activateMastodonClient(endpoint: string, redirectUrl: string): Promise<void> {
    try {
        mastodonStrategy.getClient(endpoint);
        return;
    } catch (e) {
    }
    let lookup = await FederatedClient.findOne({
        provider: "mastodon",
        endpoint: endpoint,
        redirect_url: redirectUrl,
    });
    if (lookup) {
        const newClient = {
            client_id: lookup.client_id,
            client_secret: lookup.client_secret,
            url: lookup.endpoint,
            redirect_url: lookup.redirect_url,
        }
        mastodonStrategy.addClient(newClient);
        return;
    }
    const data = (await axios.post<RawMastodonClient>("/api/v1/apps", {
        client_name: "Unified",
        website: "https://unified.feed",
        scopes: ["read", "write", "follow", "push"].join(" "),
        redirect_uris: redirectUrl
    }, {
        baseURL: endpoint
    })).data;
    await new FederatedClient({
        endpoint: endpoint,
        client_secret: data.client_secret,
        client_id: data.client_id,
        redirect_url: data.redirect_uri,
        provider: "mastodon",
    }).save()
    const newClient = {
        client_id: data.client_id,
        client_secret: data.client_secret,
        url: endpoint,
        redirect_url: data.redirect_uri,
    }
    mastodonStrategy.addClient(newClient);
    return;
}