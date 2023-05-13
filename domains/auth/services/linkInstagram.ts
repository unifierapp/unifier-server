import {IgApiClient} from "instagram-private-api";
import Account from "@/models/Account";
import {AlreadyLinkedError} from "@/utils/errors";

export default async function linkInstagram(user: Express.User, config: {
    password: string,
    username: string,
}) {
    let account = await Account.findOne({
        user: user._id,
        provider: "instagram",
    });
    if (account) {
        throw new AlreadyLinkedError();
    }
    const ig = new IgApiClient();
    ig.state.generateDevice(config.username);
    const loggedInUser = await ig.account.login(config.username, config.password);
    const serializedState = await ig.state.serialize();
    account = new Account({
        user: user._id,
        provider: "instagram",
        providerAccountId: loggedInUser.pk.toString(),
        displayName: loggedInUser.full_name,
        accessToken: JSON.stringify(serializedState),
        userName: loggedInUser.username,
    });
    await account.save();
};