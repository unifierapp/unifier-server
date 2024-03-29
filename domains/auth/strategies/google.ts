import passportGoogle, {GoogleCallbackParameters, Profile, VerifyCallback} from "passport-google-oauth20";
import User, {IUser} from "@/models/User";
import {HydratedDocument} from "mongoose";
import express from "express";
import {sendConfirmEmail} from "@/domains/auth/services/sendConfirmEmail";

const GoogleStrategy = passportGoogle.Strategy;

const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    scope: ["profile", "email"],
    passReqToCallback: true,
}, async (req: express.Request, accessToken: string, refreshToken: string, params: GoogleCallbackParameters, profile: Profile, done: VerifyCallback) => {
    try {
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
        await sendConfirmEmail(req, user.newEmail, user.emailConfirmationKey!).then();
        done(null, user);
    } catch (e) {
        if (e instanceof Error) {
            done(e);
        }
        done(new Error());
    }
});

export default googleStrategy;
