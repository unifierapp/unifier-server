import passportGoogle, {GoogleCallbackParameters, Profile, VerifyCallback} from "passport-google-oauth20";
import User, {IUser} from "@/models/User";
import * as process from "process";
import {HydratedDocument} from "mongoose";

const GoogleStrategy = passportGoogle.Strategy;

const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    scope: ["profile", "email"]
}, async (accessToken: string, refreshToken: string, params: GoogleCallbackParameters, profile: Profile, done: VerifyCallback) => {
    if (!profile.emails || profile.emails?.length === 0) {
        return done(new Error("Google profile has no emails!"));
    }
    // Sign in flow. We allow users to sign up and link directly via email, but the new account needs to be verified.
    let user: HydratedDocument<IUser> | null = await User.findOne({
        email: profile.emails[0].value,
    });
    if (!user) {
        user = await User.create({
            email: profile.emails[0].value,
            newEmail: profile.emails[0].value,
            profilePictureUrl: profile.photos?.[0].value,
            displayName: profile.displayName,
            username: profile.emails[0].value.split("@")[0],
        })
    }
    done(null, user);
});

export default googleStrategy;