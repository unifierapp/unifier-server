import getUserTimelineFunc from "@/domains/posts/services/getUserTimeline";
import express from "express";
import {z} from "zod";
import {getOptionalUrl} from "@/utils/urlHelpers";

export default async function getUserTimeline(req: express.Request, res: express.Response) {
    res.json(await getUserTimelineFunc(req.user!, z.string().parse(req.query.user_id), {
        provider: z.string().parse(req.query.provider),
        endpoint: getOptionalUrl(req.query.endpoint),
    }, {
        limit: z.number().positive().int().parse(+(z.string().optional().parse(req.query.limit) ?? 20)),
        since_id: z.string().optional().parse(req.query.since_id),
        min_id: z.string().optional().parse(req.query.min_id),
        max_id: z.string().optional().parse(req.query.max_id),
    }));
}