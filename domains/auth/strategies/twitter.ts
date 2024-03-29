import {Profile, Strategy} from "passport-twitter";
import {HydratedDocument} from "mongoose";
import {IUser} from "@/models/User";
import Account from "@/models/Account";

const callback = async (req: Express.Request,
                        accessToken: string,
                        accessTokenSecret: string,
                        profile: Profile,
                        done: (error?: Error | null, profile?: HydratedDocument<IUser>) => void) => {
    try {
        if (!req.user) {
            return done(new Error("User has not signed in beforehand."));
        }
        if (!req.user.emailVerified) {
            return done(new Error("This user is not verified."));
        }
        // Remove the old Twitter account that belongs to the user.
        await Account.findOneAndUpdate({
            provider: "twitter",
            providerAccountId: profile.id
        }, {
            $set: {
                provider: "twitter",
                user: req.user.id,
                accessToken: accessToken,
                accessTokenSecret: accessTokenSecret,
                providerAccountId: profile.id,
                userName: profile.username,
                displayName: profile.displayName,
            },
        }, {
            upsert: true
        });
        done(null, req.user);
    } catch (e) {
        if (e instanceof Error) {
            return done(e);
        }
        done(new Error());
    }
}

const twitterStrategy = new Strategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "/auth/twitter/callback",
    passReqToCallback: true,
}, callback);

export default twitterStrategy;
