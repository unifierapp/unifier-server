import {Profile, Strategy} from "passport-twitter";
import {HydratedDocument} from "mongoose";
import {IUser} from "@/models/User";
import Account from "@/models/Account";

const callback = async (req: Express.Request,
                        accessToken: string,
                        accessTokenSecret: string,
                        profile: Profile,
                        done: (error?: Error | null, profile?: HydratedDocument<IUser>) => void) => {
    if (!req.user) {
        return done(new Error("User has not signed in beforehand!"));
    }
    // Remove the old Twitter account that belongs to the user.
    await Account.findOneAndUpdate({
        provider: "twitter",
        providerAccountId: profile.id
    }, {
        $set: {
            provider: "twitter",
            userId: req.user.id,
            accessToken: accessToken,
            accessTokenSecret: accessTokenSecret,
            providerAccountId: profile.id,
            username: profile.username,
            displayName: profile.displayName,
        }
    });
    done(null, req.user);
}

const twitterStrategy = new Strategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "/api/auth/callback/twitter",
    passReqToCallback: true,
}, callback);

export default twitterStrategy;