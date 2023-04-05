import express from "express";

export function resolveRedirectAuthUrl(req: express.Request, redirectUrl: string, domain: string): string {
    const url = new URL(redirectUrl, `${req.protocol}://${req.get('host')}`);
    url.searchParams.set("domain", encodeURIComponent(domain));
    return url.toString();
}