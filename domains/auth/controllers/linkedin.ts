import express from "express";
import {z} from "zod";
import linkLinkedInFunc from "@/domains/auth/services/linkLinkedIn";

export default async function linkLinkedIn(req: express.Request, res: express.Response) {
    const username = z.string().nonempty().parse(req.body.username);
    const password = z.string().nonempty().parse(req.body.password);
    await linkLinkedInFunc(req.user!, {
        username, password,
    });
    res.json({})
}
