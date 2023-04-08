import express from "express";
import resolveProviderAccountFunc from "@/domains/providers/services/resolveProviderAccount";
import {forceOptionalNonEmptyString, forceNonEmptyString} from "@/utils/typeCheck";

export default async function resolveProviderAccount(req: express.Request, res: express.Response) {
    res.json(await resolveProviderAccountFunc(req.user!, {
        provider: forceNonEmptyString(req.query.provider),
        domain: forceOptionalNonEmptyString(req.query.domain),
        providerId: forceNonEmptyString(req.query.provider_id),
    }));
}
