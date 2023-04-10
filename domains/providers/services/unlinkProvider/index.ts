import {urlOrDomainToDomain} from "@/utils/urlHelpers";
import unlinkMastodon from "@/domains/providers/services/unlinkProvider/mastodon";
import {NotFoundError} from "@/utils/errors";

export default async function unlinkProvider(user: Express.User, config: {
    provider: string;
    domain?: string;
}) {
    let domain: string | undefined;
    if (config.domain) {
        domain = urlOrDomainToDomain(config.domain);
    }
    const mapping: Record<string, (user: Express.User, options: { domain?: string }) => Promise<void>> = {
        mastodon: unlinkMastodon
    };
    const func = mapping[config.provider];
    if (!func) {
        throw new NotFoundError("This provider does not exist.");
    }
    await func(user, {domain});
}
