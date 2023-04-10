import express from "express";
import resolveProviderAccountFunc from "@/domains/providers/services/resolveProviderAccount";
import z from "zod";

export default async function resolveProviderAccount(req: express.Request, res: express.Response) {
    res.json(await resolveProviderAccountFunc(req.user!, {
        provider: z.string().nonempty().parse(req.query.provider),
        domain: z.string().nonempty().optional().parse(req.query.domain),
        providerId: z.string().nonempty().parse(req.query.provider_id),
    }));
}
