import express from "express"
import passport from "passport";
import logout from "@/domains/auth/controllers/logout";
import mastodonLogin from "@/domains/auth/controllers/mastodon";
import {getFrontendUrl} from "@/utils/urlHelpers";
import {signUp} from "@/domains/auth/controllers/signUp";
import confirmEmail from "@/domains/auth/controllers/confirmEmail";
import {ensureAuth} from "@/utils/middlewares";
import resendConfirmEmail from "@/domains/auth/controllers/resendConfirmEmail";

const router = express.Router()

router.post("/signup", signUp);
router.get("/logout", logout);
router.post("/resend_confirmation_email", resendConfirmEmail);
router.get("/confirm_email", confirmEmail)
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
    failureRedirect: getFrontendUrl("/settings/connections"),
    successRedirect: getFrontendUrl("/settings/connections"),
    failureFlash: false
}))
router.get('/mastodon', mastodonLogin);
router.get('/mastodon/callback', mastodonLogin);
router.get('/twitter/callback', passport.authenticate('mastodon', {
    failureRedirect: getFrontendUrl("/settings/connections"),
    successRedirect: getFrontendUrl("/settings/connections"),
    failureFlash: false
}));

export default router
