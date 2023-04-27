import express from "express";
import searchProviderAccountFunction from "../services/searchProviderAccount";
import {z} from "zod";
import {getOptionalUrl} from "@/utils/urlHelpers";

export default async function searchProviderAccount(req: express.Request, res: express.Response) {
    const provider = z.string().nonempty().parse(req.query.provider);
    const endpoint = getOptionalUrl(req.query.endpoint);
    const username = z.string().parse(req.query.username);
    res.json(await searchProviderAccountFunction(req.user!, provider, {
        endpoint, username,
    }))
}
