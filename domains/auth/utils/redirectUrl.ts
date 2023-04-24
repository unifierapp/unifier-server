import express from "express";

export function resolveRedirectAuthUrl(req: express.Request, redirectUrl: string, endpoint: string): string {
    const url = new URL(redirectUrl, `${req.protocol}://${req.get('host')}`);
    url.searchParams.set("endpoint", encodeURIComponent(endpoint));
    return url.toString();
}