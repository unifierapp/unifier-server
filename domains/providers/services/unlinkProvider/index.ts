import unlinkMastodon from "@/domains/providers/services/unlinkProvider/mastodon";
import {NotFoundError} from "@/utils/errors";
import unlinkTwitter from "@/domains/providers/services/unlinkProvider/twitter";
import unlinkInstagram from "@/domains/providers/services/unlinkProvider/instagram";

export default async function unlinkProvider(user: Express.User, config: {
    provider: string;
    endpoint?: string;
}) {
    const mapping: Record<string, (user: Express.User, options: { endpoint?: string }) => Promise<void>> = {
        mastodon: unlinkMastodon,
        twitter: unlinkTwitter,
        instagram: unlinkInstagram,
    };
    const func = mapping[config.provider];
    if (!func) {
        throw new NotFoundError("This provider does not exist.");
    }
    await func(user, {endpoint: config.endpoint});
}
