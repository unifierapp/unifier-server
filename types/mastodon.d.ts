export interface ProfileField {
    name: string;
    value: string;
    verified_at: Date | null;
}

export interface ProfileSource {
    privacy: string;
    sensitive: boolean;
    language: string;
    note: string;
    fields: ProfileField[];
    follow_requests_count: number;
}

export interface ProfileEmoji {
    shortcode: string;
    url: string;
    static_url: string;
    visible_in_picker: boolean;
}

export interface Account {
    id: string;
    username: string;
    acct: string;
    display_name: string;
    locked: boolean;
    bot: boolean;
    created_at: Date;
    note: string;
    url: string;
    avatar: string;
    avatar_static: string;
    header: string;
    header_static: string;
    followers_count: number;
    following_count: number;
    statuses_count: number;
    last_status_at: Date;
    source: ProfileSource;
    emojis: ProfileEmoji[];
    fields: ProfileField[];
}

export interface MediaAttachment {
    id: string;
    type: string;
    url: string;
    preview_url: string;
    text_url: string;
}

export interface Post {
    id: string;
    created_at: Date;
    replies_count: number;
    reblogs_count: number;
    favourites_count: number;
    favourited: boolean;
    reblogged: boolean;
    muted: boolean;
    bookmarked: false;
    content: string;
    account: Account;
    media_attachments: MediaAttachment[];
    url: string;
}