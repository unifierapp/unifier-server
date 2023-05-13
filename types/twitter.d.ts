export interface Tweet {
    id: string,
    text: string,
    attachments: {media_keys: string[]},
    created_at: Date,
    author_id: string,
    public_metrics: {
        retweet_count: number,
        reply_count: number,
        like_count: number,
        quote_count: number,
    }
}

export interface TweetResponse {
    data: Tweet[],
    includes: {
        users?: User[],
        media?: Attachment[],
    },
    meta: {
        result_count: number,
        newest_id: string,
        oldest_id: string,
        next_token: string,
    },
}

export interface User {
    id: string,
    name: string,
    username: string,
    profile_image_url: string,
}

export interface Attachment {
    preview_image_url: string,
    type: string,
    url: string,
    media_key: string,
    variants: AttachmentVariant[],
    width?: number,
    height?: number,
}

export interface AttachmentVariant {
    bit_rate: number,
    content_type: string,
    url: string,
}