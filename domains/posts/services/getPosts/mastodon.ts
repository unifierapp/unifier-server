import {PaginationQuery, PaginationResult} from "@/domains/posts/services/getPosts/index";
import {urlOrDomainToUrl} from "@/utils/urlHelpers";
import axios from "axios";

export default async function getMastodonPosts(props: {
    domain: string, timelineId: string, authorizationToken: string,
}, query: PaginationQuery): Promise<PaginationResult> {
    const endpoint = urlOrDomainToUrl(props.domain);
    await axios.get(`/api/v1/timelines/list/${props.timelineId}`, {
        params: {
            max_id: query.max_id,
            since_id: query.since_id,
            min_id: query.min_id
        },
        headers: {
            Authorization: `Bearer ${props.authorizationToken}`
        },
        baseURL: endpoint,
    })
}