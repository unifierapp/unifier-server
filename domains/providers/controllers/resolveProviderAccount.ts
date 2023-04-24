import express from "express";
import resolveProviderAccountFunc from "@/domains/providers/services/resolveProviderAccount";
import z from "zod";
import {getUrl} from "@/utils/urlHelpers";

export default async function resolveProviderAccount(req: express.Request, res: express.Response) {
    res.json(await resolveProviderAccountFunc(req.user!, {
        provider: z.string().nonempty().parse(req.query.provider),
        endpoint: getUrl(req.query.endpoint),
        providerId: z.string().nonempty().parse(req.query.provider_id),
    }));
}
