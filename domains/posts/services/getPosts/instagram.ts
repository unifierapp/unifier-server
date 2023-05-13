import {PaginationQuery, PostResult} from "@/domains/posts/types";
import getAccount from "@/domains/auth/services/getAccount";
import {UnauthorizedError} from "@/utils/errors";
import {IgApiClient} from "instagram-private-api";
import {parseInstagramPost} from "@/domains/posts/services/parsePost/instagram";

export default async function getInstagramPosts(props: {
    endpoint?: string, user: Express.User,
}, query: PaginationQuery): Promise<PostResult> {
    const account = await getAccount(props.user, {
        provider: "instagram",
    });
    if (!account) {
        throw new UnauthorizedError("You haven't signed in to this service yet.");
    }
    const client = new IgApiClient();
    await client.state.deserialize(account.accessToken);
    const timeline = await client.feed.timeline();
    timeline.state = {
        more_available: true,
        next_max_id: query.max_id,
    }
    account.accessToken = JSON.stringify(await client.state.serialize());
    const response = await timeline.request();
    return {
        data: response.feed_items.filter(item => item.media_or_ad).map(item => {
            return parseInstagramPost(item.media_or_ad);
        }),
        pagination: {
            max_id: response.next_max_id,
        }
    }
}