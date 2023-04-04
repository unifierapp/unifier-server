import googleStrategy from "./google";
import User from "@/models/User";
import session from "express-session";
import * as config from "@/config";
import {mastodonStrategy} from "./mastodon";
import passport from "passport";

function activatePassport(app) {
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
        User.findById(id, (err, user) => {
            return done(err, user);
        });
    });
}

export default activatePassport;