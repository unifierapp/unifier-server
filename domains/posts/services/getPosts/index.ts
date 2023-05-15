import {HydratedDocument} from "mongoose";
import {IUser} from "@/models/User";
import getMastodonPosts from "@/domains/posts/services/getPosts/mastodon";
import getTwitterPosts from "@/domains/posts/services/getPosts/twitter";
import {ProviderConfig, PaginationQuery, PostResult} from "@/domains/posts/types";
import {NotFoundError} from "@/utils/errors";
import getFacebookPosts from "@/domains/posts/services/getPosts/facebook";
import getInstagramPosts from "@/domains/posts/services/getPosts/instagram";
import getLinkedinPosts from "@/domains/posts/services/getPosts/linkedin";

export default async function getPosts(user: HydratedDocument<IUser>, config: ProviderConfig, query: PaginationQuery): Promise<PostResult> {
    const mappings: Record<string, (props: {
        endpoint?: string, user: Express.User,
    }, query: PaginationQuery) => Promise<PostResult>> = {
        mastodon: getMastodonPosts,
        twitter: getTwitterPosts,
        instagram: getInstagramPosts,
        linkedin: getLinkedinPosts
    }

    const func = mappings[config.provider];
    if (!func) {
        throw new NotFoundError("Service not found or implemented yet.");
    }

    return await func({
        endpoint: config.endpoint, user,
    }, query);
}
