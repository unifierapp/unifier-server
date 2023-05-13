import {PaginationQuery, PostResult, RawPost} from "@/domains/posts/types";
import axios, {AxiosError} from "axios";
import getAccount from "@/domains/auth/services/getAccount";
import {NotFoundError, UnauthorizedError} from "@/utils/errors";
import Twitter from "twitter-lite";
import process from "process";
import {Attachment, Tweet, TweetResponse, User} from "@/types/twitter";
import parseTwitterPost from "@/domains/posts/services/parsePost/twitter";
import {Post} from "@/types/mastodon";

export default async function getFacebookPosts(props: {
    endpoint?: string, user: Express.User,
}, query: PaginationQuery): Promise<PostResult> {
    const account = await getAccount(props.user, {
        provider: "facebook",
    });
    if (!account) {
        throw new UnauthorizedError("You haven't signed in to this service yet.");
    }
    try {
        const apiQuery: Record<string, string | number> = {
            // limit: 20
            "access_token": account.accessToken,
        };
        // if (query.min_id) apiQuery.after = query.min_id;
        // if (query.max_id) apiQuery.before = query.max_id;
        const fetchedData = await axios.get(`/v1.0/me/home`, {
            params: apiQuery,
            baseURL: "https://graph.facebook.com",
        }).then(res => res.data);
        console.log(fetchedData);
        return {
            data: [],
            pagination: {},
        };
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
