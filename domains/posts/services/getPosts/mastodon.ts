import {PaginationQuery, PaginationResult} from "@/domains/posts/services/getPosts/index";
import {urlOrDomainToDomain, urlOrDomainToUrl} from "@/utils/urlHelpers";
import axios, {AxiosError} from "axios";
import {Post} from "@/types/mastodon";

export default async function getMastodonPosts(props: {
    domain?: string, listId: string, authorizationToken: string,
}, query: PaginationQuery): Promise<PaginationResult> {
    if (!props.domain) {
        throw new Error("You must specify a domain.");
    }
    const endpoint = urlOrDomainToUrl(props.domain);
    const domain = urlOrDomainToDomain(props.domain);
    try {
        const rawData = await axios.get<Post[]>(`/api/v1/timelines/list/${props.listId}`, {
            params: {
                max_id: query.max_id,
                since_id: query.since_id,
                min_id: query.min_id,
                limit: query.limit ?? 10,
            },
            headers: {
                Authorization: `Bearer ${props.authorizationToken}`
            },
            baseURL: endpoint,
        }).then(res => res.data);
        return {
            success: true,
            posts: rawData.map(rawPost => {
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
            }),
            status: 200,
        }
    } catch (e) {
        if (e instanceof AxiosError) {
            return {
                success: false,
                posts: [],
                status: e.status ?? 500,
            }
        }
        return {
            success: false,
            posts: [],
            status: 500,
        }
    }
}