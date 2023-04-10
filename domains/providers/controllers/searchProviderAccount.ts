import express from "express";
import searchProviderAccountFunction from "../services/searchProviderAccount";
import {z} from "zod";

export default async function searchProviderAccount(req: express.Request, res: express.Response) {
    const provider = z.string().nonempty().parse(req.query.provider);
    const domain = z.string().nonempty().optional().parse(req.query.domain);
    const username = z.string().parse(req.query.username);
    res.json(await searchProviderAccountFunction(req.user!, provider, {
        domain, username,
    }))
}
