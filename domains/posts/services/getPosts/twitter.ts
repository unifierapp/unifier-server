import {PaginationQuery, RawPost} from "@/domains/posts/services/getPosts/index";
import axios, {AxiosError} from "axios";
import {Post} from "@/types/mastodon";
import getAccount from "@/domains/auth/services/getAccount";
import {NotFoundError, UnauthorizedError} from "@/utils/errors";
import Twitter from "twitter-lite";
import process from "process";
import {Attachment, Tweet, TweetResponse, User} from "@/types/twitter";

export default async function getTwitterPosts(props: {
    endpoint?: string, user: Express.User,
}, query: PaginationQuery): Promise<RawPost[]> {
    const account = await getAccount(props.user, {
        provider: "twitter",
    });
    if (!account) {
        throw new UnauthorizedError("You haven't signed in to this service yet.");
    }
    try {
        const client = new Twitter({
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            access_token_key: account.accessToken,
            access_token_secret: account.accessTokenSecret,
            version: "2",
            extension: false,
        })
        const apiQuery: Record<string, string | number | boolean | string[]> = {
            max_results: 1,
            "tweet.fields": "attachments,created_at,public_metrics,source,entities",
            "media.fields": "preview_image_url,url,type,variants",
            "user.fields": "id,username,name,profile_image_url",
            expansions: "author_id,attachments.media_keys"
        };
        if (query.min_id) apiQuery.since_id = query.min_id;
        if (query.max_id) apiQuery.until_id = query.max_id;
        const twatResponse = (await client.get<TweetResponse>(`users/${account.providerAccountId}/timelines/reverse_chronological`, apiQuery));
        const twatterUsers: Map<string, User> = new Map();
        for (let user of twatResponse.includes?.users ?? []) {
            twatterUsers.set(user.id, user);
        }
        const twatterAttachments: Map<string, Attachment> = new Map();
        for (let attachment of twatResponse.includes?.media ?? []) {
            twatterAttachments.set(attachment.media_key, attachment);
        }
        return twatResponse.data.map(twat => {
            const twatterUser = twatterUsers.get(twat.author_id)!;
            return {
                post_id: twat.id,
                endpoint: new URL("https://twitter.com").toString(),
                url: new URL(`https://twitter.com/${twatterUser.username}/status/${twat.id}`).toString(),
                provider: "twitter",
                attachments: twat.attachments?.media_keys?.map(attachmentId => {
                    const attachment = twatterAttachments.get(attachmentId)!;
                    return {
                        url: attachment.url,
                        type: attachment.type,
                        preview_url: attachment.preview_image_url,
                        variants: attachment.variants,
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
