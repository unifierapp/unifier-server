import express from "express";
import getOrCreateProviderAccountListFunc from "@/domains/providers/services/getOrCreateProviderList";
import z from "zod";
import {getOptionalUrl} from "@/utils/urlHelpers";

export default async function getOrCreateProviderList(req: express.Request, res: express.Response) {
    let provider = z.string().nonempty().parse(req.query.provider);
    let endpoint = getOptionalUrl(req.query.endpoint);
    const listId = await getOrCreateProviderAccountListFunc(req.user!, {
        provider,
        endpoint,
    });
    return res.json({id: listId})
}
