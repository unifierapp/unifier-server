import FederatedClient from "@/models/FederatedClient";
import {urlOrDomainToDomain} from "@/utils/urlHelpers";

export default function getMastodonClient(urlOrDomain: string) {
    return FederatedClient.findOne({
        provider: "mastodon",
        domain: urlOrDomainToDomain(urlOrDomain),
    })
}