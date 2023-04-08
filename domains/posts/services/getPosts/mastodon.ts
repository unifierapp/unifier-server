import {PaginationQuery, RawPost} from "@/domains/posts/services/getPosts/index";
import {urlOrDomainToDomain, urlOrDomainToUrl} from "@/utils/urlHelpers";
import axios, {AxiosError} from "axios";
import {Post} from "@/types/mastodon";
import getAccount from "@/domains/auth/services/getAccount";
import {NotFoundError, UnauthorizedError} from "@/utils/errors";

export default async function getMastodonPosts(props: {
    domain?: string, user: Express.User,
}, query: PaginationQuery): Promise<RawPost[]> {
    if (!props.domain) {
        throw new Error("You must specify a domain.");
    }
    const endpoint = urlOrDomainToUrl(props.domain);
    const domain = urlOrDomainToDomain(props.domain);
    const account = await getAccount(props.user, {
        provider: "mastodon",
        domain: domain,
    });
    if (!account) {
        throw new UnauthorizedError("You haven't signed in to this service yet.");
    }
    if (!account.internalListId) {
        throw new NotFoundError("You must create a list before being able to access the timeline.");
    }
    try {
        const rawData = await axios.get<Post[]>(`/api/v1/timelines/list/${account.internalListId}`, {
            params: {
                max_id: query.max_id,
                since_id: query.since_id,
                min_id: query.min_id,
                limit: query.limit ?? 10,
            },
            headers: {
                Authorization: `Bearer ${account.accessToken}`
            },
            baseURL: endpoint,
        }).then(res => res.data);
        return rawData.map(rawPost => {
            return {
                domain: domain,
                provider: "mastodon",
                post_id: rawPost.id,
                account_id: rawPost.account.id,
                attachments: rawPost.media_attachments,
                engagement_stats: {
                    likes: rawPost.favourites_count,
                    comments: rawPost.replies_count,
                    reposts: rawPost.reblogs_count,
                },
                content: rawPost.content,
                created_at: rawPost.created_at,
                url: rawPost.url,
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
