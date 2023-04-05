import express from "express"
import passport from "passport";
import * as process from "process";
import logout from "@/domains/auth/controllers/logout";
import mastodonLogin from "@/domains/auth/controllers/mastodon";
import {errorHandling} from "@/utils/middlewares";
import {HTTPError} from "@/utils/errors";

const router = express.Router()

function getFrontendUrl(url: string) {
    return new URL(url, process.env.FRONTEND_URL).toString();
}

router.get("/logout", logout)

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: getFrontendUrl("/"),
    successRedirect: getFrontendUrl("/dashboard"),
    failureFlash: false
}))

router.get('/twitter', passport.authenticate('twitter', {
    scope: ['profile', 'email']
}))
router.get('/twitter/callback', passport.authenticate('twitter', {
    failureRedirect: getFrontendUrl("/settings"),
    successRedirect: getFrontendUrl("/settings"),
    failureFlash: false
}))

router.get('/mastodon', mastodonLogin);
router.get('/mastodon/callback', mastodonLogin);

router.get('/twitter/callback', passport.authenticate('mastodon', {
    failureRedirect: getFrontendUrl("/settings"),
    successRedirect: getFrontendUrl("/settings"),
    failureFlash: false
}));

export default router
