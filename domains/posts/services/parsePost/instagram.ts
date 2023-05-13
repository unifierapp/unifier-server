import {TimelineFeedResponseMedia_or_ad, UserFeedResponseItemsItem} from "instagram-private-api";
import {Attachment, RawPost} from "@/domains/posts/types";
import mimeTypes from "mime-types";

export function parseInstagramPost(post: TimelineFeedResponseMedia_or_ad | UserFeedResponseItemsItem): RawPost {
    let attachments: Attachment[];
    let url: string;
    if (post.media_type === 2) {
        attachments = [{
            width: post.original_width,
            height: post.original_height,
            variants: post.video_versions?.map((version) => {
                return {
                    url: version.url,
                    content_type: mimeTypes.lookup(new URL(version.url, "https://example.com").pathname) || "",
                }
            }),
            type: "video",
            url: post.video_versions?.[0].url ?? "",
        }];
        url = `https://instagram.com/reel/${post.code}`;
    } else if (post.media_type === 1) {
        console.log(post);
        attachments = [{
            width: post.original_width,
            height: post.original_height,
            type: "image",
            url: post.image_versions2?.candidates[0].url ?? "",
        }];
        url = `https://instagram.com/p/${post.code}`;
    } else {
        attachments = [];
        url = ""
    }
    return {
        post_id: post.id,
        provider_account: {
            username: post.user.username,
            display_name: post.user.full_name,
            id: String(post.user.pk),
            profile_image_url: post.user.profile_pic_url,
        },
        engagement_stats: {
            likes: post.like_count,
            comments: post.comment_count,
        },
        content: post.caption?.text ?? "",
        endpoint: "https://instagram.com",
        created_at: new Date(post.taken_at * 1000),
        provider: "instagram",
        attachments: attachments,
        url: url,
    }
}