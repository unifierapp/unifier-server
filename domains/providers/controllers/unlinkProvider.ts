import express from "express";
import {z} from "zod";
import unlinkProviderFunc from "@/domains/providers/services/unlinkProvider";

export default async function unlinkProvider(req: express.Request, res: express.Response) {
    const provider = z.string().nonempty().parse(req.body.provider);
    const endpoint = z.string().nonempty().optional().parse(req.body.endpoint);

    await unlinkProviderFunc(req.user!, {
        provider, endpoint
    });

    res.json({});
}
