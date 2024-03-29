import {Attachment, PaginationQuery, PostResult} from "@/domains/posts/types";
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
            const attachments: Attachment[] = [];
            if (item.videoAttachment) {
                attachments.push({
                    type: "video",
                    url: item.videoAttachment.progressiveStreams[0].streamingLocations[0].url,
                    width: item.videoAttachment.progressiveStreams[0].width,
                    height: item.videoAttachment.progressiveStreams[0].height,
                    variants: item.videoAttachment.progressiveStreams.map(variant => {
                        return {
                            url: variant.streamingLocations[0].url,
                            content_type: variant.mediaType,
                            bit_rate: variant.bitRate,
                        }
                    })
                });
            }
            if (item.imageAttachments) {
                item.imageAttachments.forEach(attachment => {
                    const url = `${attachment.rootUrl}${attachment.artifacts[0].fileIdentifyingUrlPathSegment}`;
                    attachments.push({
                        url: url,
                        width: attachment.artifacts[0].width,
                        height: attachment.artifacts[0].height,
                        type: "image",
                    });
                })
            }
            return {
                post_id: item.entityUrn,
                url: `https://linkedin.com/feed/update/${item.updateMetadata.urn}`,
                provider: "linkedin",
                engagement_stats: {
                    likes: item.socialActivityCount.numLikes,
                    reposts: item.socialActivityCount.numShares,
                    comments: item.socialActivityCount.numComments,
                },
                provider_account: {
                    username: item.profile.publicIdentifier ?? "",
                    id: item.profile.entityUrn ?? "",
                    profile_image_url: item.profile.picture ? `${item.profile.picture?.rootUrl}${item.profile.picture?.artifacts[0].fileIdentifyingUrlPathSegment}` : "",
                    display_name: `${item.profile.firstName} ${item.profile.lastName}`
                },
                content: item.commentary?.text.text ?? "",
                endpoint: "https://linkedin.com",
                attachments: attachments,
                created_at: new Date(),
            }
        }),
        pagination: {
            max_id: `${timeline.skip + timeline.limit}`,
        }
    }
}