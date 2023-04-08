import express from "express";
import getOrCreateProviderAccountListFunc from "@/domains/providers/services/getOrCreateProviderList";
import {forceOptionalNonEmptyString, forceNonEmptyString} from "@/utils/typeCheck";

export default async function getOrCreateProviderList(req: express.Request, res: express.Response) {
    let provider = forceNonEmptyString(req.query.provider);
    let domain = forceOptionalNonEmptyString(req.query.domain);
    const listId = await getOrCreateProviderAccountListFunc(req.user!, {
        provider,
        domain,
    });
    return res.json({id: listId})
}
