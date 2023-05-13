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
        reposts?: number,
    }
}

export interface PostResult {
    data: RawPost[],
    pagination: {
        max_id?: string,
        min_id?: string,
    }
}

interface AttachmentVariant {
    bit_rate?: number,
    content_type: string,
    url: string,
}


interface Attachment {
    type: string,
    url: string,
    preview_url?: string,
    variants?: AttachmentVariant[],
    width?: number,
    height?: number,
}


export interface ProviderConfig {
    provider: string,
    endpoint?: string,
}