import express from "express";
import getOrCreateProviderAccountListFunc from "@/domains/providers/services/getOrCreateProviderList";
import {BadArgumentError} from "@/utils/errors";

export default async function getOrCreateProviderList(req: express.Request, res: express.Response) {
    let provider = req.query.provider;
    let domain = req.query.domain;
    if (typeof provider !== 'string') {
        throw new BadArgumentError("Missing provider string.");
    }
    if (domain && typeof domain !== 'string') {
        throw new BadArgumentError("Invalid domain argument.");
    }
    const listId = await getOrCreateProviderAccountListFunc(req.user!, {
        provider,
        domain,
    });
    return res.json({id: listId})
}