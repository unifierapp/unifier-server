import {PaginationQuery, PostResult} from "@/domains/posts/types";
import getAccount from "@/domains/auth/services/getAccount";
import {NotFoundError, UnauthorizedError} from "@/utils/errors";
import {IgApiClient} from "instagram-private-api";
import {parseInstagramPost} from "@/domains/posts/services/parsePost/instagram";

export default async function getInstagramUserTimeline(props: {
    endpoint?: string, user: Express.User, profile: Express.User,
}, query: PaginationQuery): Promise<PostResult> {
    const account = await getAccount(props.user, {
        provider: "instagram",
    });
    if (!account) {
        throw new UnauthorizedError("You haven't signed in to this service yet.");
    }
    const profile = await getAccount(props.profile, {
        provider: "instagram",
    });
    if (!profile) {
        throw new NotFoundError("This profile does not have this type of account.");
    }
    const client = new IgApiClient();
    await client.state.deserialize(account.accessToken);
    console.log(client.state.extractUserId());
    const timeline = await client.feed.user(profile.providerAccountId);
    account.accessToken = JSON.stringify(await client.state.serialize());
    await account.save();
    const response = await timeline.request();
    return {
        data: response.items.map(item => {
            return parseInstagramPost(item);
        }),
        pagination: {
            max_id: response.next_max_id,
        }
    }
}