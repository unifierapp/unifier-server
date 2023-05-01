import {HydratedDocument} from "mongoose";
import {IUser} from "@/models/User";
import getMastodonPosts from "@/domains/posts/services/getPosts/mastodon";
import getTwitterPosts from "@/domains/posts/services/getPosts/twitter";
import {ProviderConfig, PaginationQuery, RawPost} from "@/domains/posts/types";
import {NotFoundError} from "@/utils/errors";

export default async function getPosts(user: HydratedDocument<IUser>, config: ProviderConfig, query: PaginationQuery): Promise<RawPost[]> {
    const mappings: Record<string, (props: {
        endpoint?: string, user: Express.User,
    }, query: PaginationQuery) => Promise<RawPost[]>> = {
        mastodon: getMastodonPosts,
        twitter: getTwitterPosts,
    }

    const func = mappings[config.provider];
    if (!func) {
        throw new NotFoundError("Service not found or implemented yet.");
    }

    return await func({
        endpoint: config.endpoint, user,
    }, query);
}
