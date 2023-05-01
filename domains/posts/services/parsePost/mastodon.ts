import {RawPost} from "@/domains/posts/types";
import {Post} from "@/types/mastodon";

export default function parseMastodonPost(endpoint: string, fetchedPost: Post): RawPost {
    return {
        endpoint: endpoint,
        provider: "mastodon",
        post_id: fetchedPost.id,
        provider_account: {
            id: fetchedPost.account.id,
            username: fetchedPost.account.username,
            display_name: fetchedPost.account.display_name,
            profile_image_url: fetchedPost.account.avatar_static,
        },
        attachments: fetchedPost.media_attachments,
        engagement_stats: {
            likes: fetchedPost.favourites_count,
            comments: fetchedPost.replies_count,
            reposts: fetchedPost.reblogs_count,
        },
        content: fetchedPost.content,
        created_at: fetchedPost.created_at,
        url: new URL(`/@${fetchedPost.account.acct}/${fetchedPost.id}`, endpoint).toString(),
    }
}