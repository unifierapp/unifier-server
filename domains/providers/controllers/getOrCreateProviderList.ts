import express from "express";
import getOrCreateProviderAccountListFunc from "@/domains/providers/services/getOrCreateProviderList";
import z from "zod";

export default async function getOrCreateProviderList(req: express.Request, res: express.Response) {
    let provider = z.string().nonempty().parse(req.query.provider);
    let domain = z.string().nonempty().optional().parse(req.query.domain);
    const listId = await getOrCreateProviderAccountListFunc(req.user!, {
        provider,
        domain,
    });
    return res.json({id: listId})
}
