import {Attachment, Tweet, User} from "@/types/twitter";

export default function parseTwitterPost(twat: Tweet, meta: {
    attachments: Map<string, Attachment>,
    users: Map<string, User>
}) {
    const twatterUser = meta.users.get(twat.author_id)!;
    return {
        post_id: twat.id,
        endpoint: new URL("https://twitter.com").toString(),
        url: new URL(`https://twitter.com/${twatterUser.username}/status/${twat.id}`).toString(),
        provider: "twitter",
        attachments: twat.attachments?.media_keys?.map(attachmentId => {
            const attachment = meta.attachments.get(attachmentId)!;
            return {
                url: attachment.url,
                type: attachment.type,
                preview_url: attachment.preview_image_url,
                variants: attachment.variants,
                width: attachment.width,
                height: attachment.height,
            }
        }) ?? [],
        content: twat.text,
        created_at: twat.created_at,
        engagement_stats: {
            comments: twat.public_metrics.reply_count,
            likes: twat.public_metrics.like_count,
            reposts: twat.public_metrics.retweet_count + twat.public_metrics.quote_count,
        },
        provider_account: {
            id: twatterUser.id,
            username: twatterUser.username,
            display_name: twatterUser.name,
            profile_image_url: twatterUser.profile_image_url,
        },
    }
}