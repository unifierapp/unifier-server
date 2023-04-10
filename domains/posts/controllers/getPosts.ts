import getPostsFunc from "@/domains/posts/services/getPosts";
import express from "express";
import {z} from "zod";

export default async function getPosts(req: express.Request, res: express.Response) {
    res.json(await getPostsFunc(req.user!, {
        provider: z.string().parse(req.query.provider),
        domain: z.string().optional().parse(req.query.domain),
    }, {
        limit: z.number().positive().int().parse(z.string().optional().parse(req.query.limit) ?? 20),
        since_id: z.string().optional().parse(req.query.since_id),
        min_id: z.string().optional().parse(req.query.min_id),
        max_id: z.string().optional().parse(req.query.max_id),
    }));
}