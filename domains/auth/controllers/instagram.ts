import express from "express";
import {z} from "zod";
import linkInstagramFunc from "@/domains/auth/services/linkInstagram";

export default async function linkInstagram(req: express.Request, res: express.Response) {
    const username = z.string().nonempty().parse(req.body.username);
    const password = z.string().nonempty().parse(req.body.password);
    await linkInstagramFunc(req.user!, {
        username, password,
    });
    res.json({})
}