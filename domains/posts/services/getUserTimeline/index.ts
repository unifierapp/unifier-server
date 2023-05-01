import {HydratedDocument} from "mongoose";
import User, {IUser} from "@/models/User";
import {ProviderConfig, PaginationQuery, RawPost} from "@/domains/posts/types";
import {NotFoundError} from "@/utils/errors";
import getMastodonUserTimeline from "@/domains/posts/services/getUserTimeline/mastodon";
import getTwitterUserTimeline from "@/domains/posts/services/getUserTimeline/twitter";

export default async function getUserTimeline(user: HydratedDocument<IUser>, profileId: string, config: ProviderConfig, query: PaginationQuery): Promise<RawPost[]> {
    const mappings: Record<string, (props: {
        endpoint?: string, user: Express.User, profile: Express.User,
    }, query: PaginationQuery) => Promise<RawPost[]>> = {
        mastodon: getMastodonUserTimeline,
        twitter: getTwitterUserTimeline
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
