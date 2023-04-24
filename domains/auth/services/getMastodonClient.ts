import FederatedClient from "@/models/FederatedClient";

export default function getMastodonClient(endpoint: string) {
    return FederatedClient.findOne({
        provider: "mastodon",
        endpoint: endpoint,
    })
}