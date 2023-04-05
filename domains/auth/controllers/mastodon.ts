import axios from "axios";
import activateMastodonClient from "@/domains/auth/services/activateMastodonClient";
import express from "express";
import {resolveRedirectAuthUrl} from "@/domains/auth/utils/redirectUrl";
import passport from "passport";

const mastodonMiddleware = passport.authenticate("mastodon", {
    successRedirect: "/settings",
    failureRedirect: "/settings",
});

export default async function mastodonLogin(req: express.Request, res: express.Response) {
    if (!req.query.domain) {
        throw new Error("You have to specify a domain.")
    }
    const domain = req.query.domain as string;
    await activateMastodonClient(domain, resolveRedirectAuthUrl(req, "/auth/mastodon/callback", domain));
    mastodonMiddleware(req, res);
}