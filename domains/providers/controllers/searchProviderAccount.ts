import express from "express";
import searchProviderAccountFunction from "../services/searchProviderAccount";
import {forceString, forceNonEmptyString, forceOptionalNonEmptyString} from "@/utils/typeCheck";

export default async function searchProviderAccount(req: express.Request, res: express.Response) {
    const provider = forceNonEmptyString(req.query.provider);
    const domain = forceOptionalNonEmptyString(req.query.domain);
    const username = forceString(req.query.username);
    res.json(await searchProviderAccountFunction(req.user!, provider, {
        domain, username,
    }))
}
