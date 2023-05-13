import {PaginationQuery, PostResult, RawPost} from "@/domains/posts/types";
import axios, {AxiosError} from "axios";
import {Post} from "@/types/mastodon";
import getAccount from "@/domains/auth/services/getAccount";
import {NotFoundError, UnauthorizedError} from "@/utils/errors";
import {z} from "zod";
import parseMastodonPost from "@/domains/posts/services/parsePost/mastodon";

export default async function getMastodonUserTimeline(props: {
    profile: Express.User, endpoint?: string, user: Express.User,
}, query: PaginationQuery): Promise<PostResult> {
    const endpoint = z.string().nonempty().parse(props.endpoint);
    const account = await getAccount(props.user, {
        provider: "mastodon",
        endpoint: endpoint,
    });
    if (!account) {
        throw new UnauthorizedError("You haven't signed in to this service yet.");
    }
    const profile = await getAccount(props.profile, {
        provider: "mastodon",
        endpoint: endpoint
    });
    if (!profile) {
        throw new NotFoundError("This profile does not have this type of account.");
    }
    try {
        const fetchedData = await axios.get<Post[]>(`/api/v1/accounts/${profile.providerAccountId}/statuses`, {
            params: {
                max_id: query.max_id,
                since_id: query.since_id,
                min_id: query.min_id,
                limit: 20,
            },
            headers: {
                Authorization: `Bearer ${account.accessToken}`
            },
            baseURL: endpoint,
        }).then(res => res.data);
        const result = fetchedData.map(fetchedPost => parseMastodonPost(endpoint, fetchedPost)).sort((post1, post2) => {
            return post2.post_id.localeCompare(post1.post_id);
        });
        return {
            data: result,
            pagination: {
                max_id: result[0].post_id,
                min_id: result[result.length - 1].post_id,
            }
        };
    } catch (e) {
        if (e instanceof AxiosError) {
            if (e.status === 401 || e.status === 403) {
                throw new UnauthorizedError("This access token is invalid.");
            }
            if (e.status === 404) {
                throw new NotFoundError("This user timeline does not exist.");
            }
        }
        throw e;
    }
}
