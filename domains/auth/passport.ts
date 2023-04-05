import googleStrategy from "./strategies/google";
import User from "@/models/User";
import session from "express-session";
import * as config from "@/config";
import {mastodonStrategy} from "./strategies/mastodon";
import passport from "passport";
import express from "express";

function activatePassport(app: express.Express) {
    app.use(session(config.SESSION_CONFIG));
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(googleStrategy);
    passport.use(mastodonStrategy);
    passport.use(User.createStrategy());
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        User.findById(id).then(user => done(null, user)).catch(error => done(error));
    });
}

export default activatePassport;
