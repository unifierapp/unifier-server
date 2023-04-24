import {HydratedDocument} from "mongoose";
import {IUser} from "@/models/User";
import getMastodonPosts from "@/domains/posts/services/getPosts/mastodon";

export interface PaginationQuery {
    min_id?: string,
    max_id?: string,
    since_id?: string,
    limit?: number,
}

export interface RawPost {
    post_id: string;
    provider: string;
    endpoint: string;
    provider_account: {
        username: string;
        id: string;
        display_name: string;
        profile_image_url: string;
    };
    url: string;
    created_at: Date;
    content: string;
    attachments: Attachment[],
    engagement_stats: {
        likes: number,
        comments: number,
        reposts: number,
    }
}

interface Attachment {
    type: string,
    url: string,
    preview_url: string,
}

export interface ProviderConfig {
    provider: string,
    endpoint?: string,
}

export default async function getPosts(user: HydratedDocument<IUser>, config: ProviderConfig, query: PaginationQuery): Promise<RawPost[]> {
    const mappings: Record<string, (props: {
        endpoint?: string, user: Express.User,
    }, query: PaginationQuery) => Promise<RawPost[]>> = {
        mastodon: getMastodonPosts
    }

    const func = mappings[config.provider];

    return await func({
        endpoint: config.endpoint, user,
    }, query);
}
