import {Strategy} from "passport-facebook"
import process from "process";
import {UnauthorizedError} from "@/utils/errors";
import Account from "@/models/Account";

const facebookStrategy = new Strategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "/auth/facebook/callback",
    passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        if (!req.user) {
            return done(new UnauthorizedError("You must sign in first before linking your Facebook account."));
        }
        if (!req.user.emailVerified) {
            return done(new Error("This user is not verified."));
        }
        // Remove the old Twitter account that belongs to the user.
        await Account.findOneAndUpdate({
            provider: "facebook",
            providerAccountId: profile.id
        }, {
            $set: {
                provider: "facebook",
                user: req.user.id,
                accessToken: accessToken,
                refreshToken: refreshToken,
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
});

export default facebookStrategy;