import express from "express";
import searchProviderAccountFunction from "../services/searchProviderAccount";
import {BadArgumentError, NotFoundError} from "@/utils/errors";

export default async function searchProviderAccount(req: express.Request, res: express.Response) {
    const provider: unknown = req.query.provider;
    if (typeof provider !== "string") {
        throw new NotFoundError("You must specify a provider.");
    }
    const domain: string | undefined = req.query.domain as string | undefined;
    const username = req.query.username ?? "";
    if (username && typeof username !== 'string') {
        throw new BadArgumentError("Invalid username format.");
    }
    res.json(await searchProviderAccountFunction(provider, {
        domain, username,
    }))
}