import {PaginationQuery, RawPost} from "@/domains/posts/services/getPosts/index";
import axios, {AxiosError} from "axios";
import {Post} from "@/types/mastodon";
import getAccount from "@/domains/auth/services/getAccount";
import {NotFoundError, UnauthorizedError} from "@/utils/errors";
import {z} from "zod";
import {raw} from "express";

export default async function getMastodonPosts(props: {
    endpoint?: string, user: Express.User,
}, query: PaginationQuery): Promise<RawPost[]> {
    const endpoint = z.string().nonempty().parse(props.endpoint);
    const account = await getAccount(props.user, {
        provider: "mastodon",
        endpoint: endpoint,
    });
    if (!account) {
        throw new UnauthorizedError("You haven't signed in to this service yet.");
    }
    try {
        console.log(account.accessToken);
        const rawData = await axios.get<Post[]>(`/api/v1/timelines/home`, {
            params: {
                max_id: query.max_id,
                since_id: query.since_id,
                min_id: query.min_id,
                limit: query.limit ?? 10,
            },
            headers: {
                Authorization: `Bearer ${account.accessToken}`
            },
            baseURL: endpoint,
        }).then(res => res.data);
        return rawData.map(rawPost => {
            return {
                endpoint: endpoint,
                provider: "mastodon",
                post_id: rawPost.id,
                provider_account: {
                    id: rawPost.account.id,
                    username: rawPost.account.username,
                    display_name: rawPost.account.display_name,
                    profile_image_url: rawPost.account.avatar_static,
                },
                attachments: rawPost.media_attachments,
                engagement_stats: {
                    likes: rawPost.favourites_count,
                    comments: rawPost.replies_count,
                    reposts: rawPost.reblogs_count,
                },
                content: rawPost.content,
                created_at: rawPost.created_at,
                url: rawPost.url,
            }
        });
    } catch (e) {
        if (e instanceof AxiosError) {
            if (e.status === 401 || e.status === 403) {
                throw new UnauthorizedError("This list belongs to an account you have log out. " +
                    "Please sign in with the right account or generate a new list.")
            }
            if (e.status === 404) {
                throw new NotFoundError("This list is not found. Please generate a new list.")
            }
        }
        throw e;
    }
}
