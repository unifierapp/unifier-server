import FederatedClient from "@/models/FederatedClient";
import {urlOrDomainToDomain} from "@/utils/urlHelpers";

export default function getMastodonClient(urlOrDomain) {
    return FederatedClient.findOne({
        provider: "mastodon",
        domain: urlOrDomainToDomain(urlOrDomain),
    })
}