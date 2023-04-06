import {HydratedDocument} from "mongoose";
import {IUser} from "@/models/User";

export interface PaginationQuery {
    min_id: string,
    max_id: string,
    since_id: string,
}

export interface RawPost {
    post_id: string,
    provider: string,
    domain: string,
    url: string,
    created_at: string,
    profile_picture: string,
    profile_id: string,
    account_id: string,
    content: string,
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

export interface PaginationResult {
    success: boolean,
    post: RawPost[],
    errorCode?: string,
}

export interface ProviderConfig {
    provider: string,
    domain?: string,
}

export default function getPosts(user: HydratedDocument<IUser>, queries: Map<ProviderConfig, PaginationQuery>) {
    const mappings: Record<string, any> = {

    }
    const rawResults = new Map<ProviderConfig, PaginationResult>();

}