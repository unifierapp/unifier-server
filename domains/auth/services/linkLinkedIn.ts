import {Client as LinkedinClient} from "linkedin-private-api-expanded";
import Account from "@/models/Account";
import {AlreadyLinkedError, UnauthorizedError} from "@/utils/errors";

export default async function linkLinkedIn(user: Express.User, config: {
    password: string,
    username: string,
}) {
    let account = await Account.findOne({
        user: user._id,
        provider: "linkedin",
    });
    if (account) {
        throw new AlreadyLinkedError();
    }
    const linkedinClient = new LinkedinClient();
    await linkedinClient.login.userPass({
        username: config.username,
        password: config.password,
    });
    const profile = await linkedinClient.profile.getOwnProfile();

    if (!profile) {
        throw new UnauthorizedError("Missing profile.");
    }

    const serializedState = await linkedinClient.login.serialize();
    account = new Account({
        user: user._id,
        provider: "linkedin",
        providerAccountId: profile?.entityUrn,
        displayName: `${profile.firstName} ${profile.lastName}`,
        accessToken: JSON.stringify(serializedState),
        userName: `${profile.publicIdentifier}`,
    });
    await account.save();
};
