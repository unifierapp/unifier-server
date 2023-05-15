import {PaginationQuery, PostResult} from "@/domains/posts/types";
import getAccount from "@/domains/auth/services/getAccount";
import {UnauthorizedError} from "@/utils/errors";
import {Client as LinkedinClient} from "linkedin-private-api-expanded";

export default async function getLinkedinPosts(props: {
    endpoint?: string, user: Express.User,
}, query: PaginationQuery): Promise<PostResult> {
    const account = await getAccount(props.user, {
        provider: "linkedin",
    });
    if (!account) {
        throw new UnauthorizedError("You haven't signed in to this service yet.");
    }
    const client = new LinkedinClient();
    client.login.deserialize(JSON.parse(account.accessToken));
    const timeline = await client.feed.getHome({type: "chronological", skip: +(query.max_id ?? 0), limit: query.limit});
    const posts = await timeline.scrollNext();
    return {
        data: posts.map(item => {
            return {
                post_id: item.entityUrn,
                url: "",
                provider: "linkedin",
                engagement_stats: {
                    likes: item.socialActivityCount.numLikes,
                    reposts: item.socialActivityCount.numShares,
                    comments: item.socialActivityCount.numComments,
                },
                provider_account: {
                    username: item.profile.publicIdentifier ?? "",
                    id: item.profile.entityUrn ?? "",
                    profile_image_url: `${item.profile.picture?.rootUrl}${item.profile.picture?.artifacts[0].fileIdentifyingUrlPathSegment}` ?? "",
                    display_name: `${item.profile.firstName} ${item.profile.lastName}`
                },
                content: item.commentary?.text.text ?? "",
                endpoint: "https://linkedin.com",
                attachments: [],
                created_at: new Date(),
            }
        }),
        pagination: {
            max_id: `${timeline.skip + timeline.limit}`,
        }
    }
}