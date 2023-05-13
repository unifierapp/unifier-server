import {HydratedDocument} from "mongoose";
import User, {IUser} from "@/models/User";
import {ProviderConfig, PaginationQuery, RawPost, PostResult} from "@/domains/posts/types";
import {NotFoundError} from "@/utils/errors";
import getMastodonUserTimeline from "@/domains/posts/services/getUserTimeline/mastodon";
import getTwitterUserTimeline from "@/domains/posts/services/getUserTimeline/twitter";
import getInstagramUserTimeline from "@/domains/posts/services/getUserTimeline/instagram";

export default async function getUserTimeline(user: HydratedDocument<IUser>, profileId: string, config: ProviderConfig, query: PaginationQuery): Promise<PostResult> {
    const mappings: Record<string, (props: {
        endpoint?: string, user: Express.User, profile: Express.User,
    }, query: PaginationQuery) => Promise<PostResult>> = {
        mastodon: getMastodonUserTimeline,
        twitter: getTwitterUserTimeline,
        instagram: getInstagramUserTimeline,
    }

    const func = mappings[config.provider];
    if (!func) {
        throw new NotFoundError("Service not found or implemented yet.");
    }

    const profile = await User.findById(profileId);
    if (!profile) {
        throw new NotFoundError("User not found.");
    }

    return await func({
        endpoint: config.endpoint, user, profile,
    }, query);
}
