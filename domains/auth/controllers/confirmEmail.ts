import express from "express";
import z from "zod";
import confirmEmailFunc from "@/domains/auth/services/confirmEmail";
import {getFrontendUrl} from "@/utils/urlHelpers";

export default async function confirmEmail(req: express.Request, res: express.Response) {
    const token = z.string().nonempty().parse(req.query.token);
    await confirmEmailFunc(token);
    res.redirect(getFrontendUrl("/dashboard"));
}