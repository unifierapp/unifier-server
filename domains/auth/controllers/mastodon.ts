import activateMastodonClient from "@/domains/auth/services/activateMastodonClient";
import express from "express";
import {resolveRedirectAuthUrl} from "@/domains/auth/utils/redirectUrl";
import passport from "passport";
import {getFrontendUrl, getUrl} from "@/utils/urlHelpers";

const mastodonMiddleware = passport.authenticate("mastodon", {
    successRedirect: getFrontendUrl("/settings"),
    failureRedirect: getFrontendUrl("/settings"),
});

export default async function mastodonLogin(req: express.Request, res: express.Response) {
    const endpoint = getUrl(req.query.endpoint);
    await activateMastodonClient(endpoint, resolveRedirectAuthUrl(req, "/auth/mastodon/callback", endpoint));
    mastodonMiddleware(req, res);
}