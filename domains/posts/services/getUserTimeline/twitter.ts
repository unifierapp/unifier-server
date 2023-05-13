import {PaginationQuery, PostResult, RawPost} from "@/domains/posts/types";
import {AxiosError} from "axios";
import getAccount from "@/domains/auth/services/getAccount";
import {NotFoundError, UnauthorizedError} from "@/utils/errors";
import Twitter from "twitter-lite";
import process from "process";
import {Attachment, TweetResponse, User} from "@/types/twitter";
import parseTwitterPost from "@/domains/posts/services/parsePost/twitter";

export default async function getTwitterUserTimeline(props: {
    endpoint?: string, user: Express.User, profile: Express.User,
}, query: PaginationQuery): Promise<PostResult> {
    const account = await getAccount(props.user, {
        provider: "twitter",
    });
    if (!account) {
        throw new UnauthorizedError("You haven't signed in to this service yet.");
    }
    const profile = await getAccount(props.profile, {
        provider: "twitter",
    });
    if (!profile) {
        throw new NotFoundError("This profile does not have this type of account.");
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
            max_results: query.limit ?? 50,
            exclude: "replies",
            "tweet.fields": "attachments,created_at,public_metrics,source,entities",
            "media.fields": "preview_image_url,url,type,variants,width,height",
            "user.fields": "id,username,name,profile_image_url",
            expansions: "author_id,attachments.media_keys"
        };
        if (query.min_id) apiQuery.since_id = query.min_id;
        if (query.max_id) apiQuery.until_id = query.max_id;
        const twatResponse = (await client.get<TweetResponse>(`users/${account.providerAccountId}/tweets`, apiQuery));
        const twatterUsers: Map<string, User> = new Map();
        for (let user of twatResponse.includes?.users ?? []) {
            twatterUsers.set(user.id, user);
        }
        const twatterAttachments: Map<string, Attachment> = new Map();
        for (let attachment of twatResponse.includes?.media ?? []) {
            twatterAttachments.set(attachment.media_key, attachment);
        }
        return {
            data: twatResponse.data?.map?.(twat => parseTwitterPost(twat, {
                users: twatterUsers,
                attachments: twatterAttachments,
            })) ?? [],
            pagination: {
                max_id: twatResponse.meta.oldest_id,
                min_id: twatResponse.meta.newest_id,
            }
        }
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
