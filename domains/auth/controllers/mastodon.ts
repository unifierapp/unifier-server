import activateMastodonClient from "@/domains/auth/services/activateMastodonClient";
import express from "express";
import {resolveRedirectAuthUrl} from "@/domains/auth/utils/redirectUrl";
import passport from "passport";
import {z} from "zod";

const mastodonMiddleware = passport.authenticate("mastodon", {
    successRedirect: "/settings",
    failureRedirect: "/settings",
});

export default async function mastodonLogin(req: express.Request, res: express.Response) {
    const endpoint = z.string().nonempty().parse(req.query.endpoint);
    await activateMastodonClient(endpoint, resolveRedirectAuthUrl(req, "/auth/mastodon/callback", endpoint));
    mastodonMiddleware(req, res);
}