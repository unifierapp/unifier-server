import express from "express";
import {UnauthorizedError} from "@/utils/errors";
import z from "zod";
import editEmailFunc from "@/domains/users/services/editEmail";
import {sendConfirmEmail} from "@/domains/auth/services/sendConfirmEmail";

export default async function editEmail(req: express.Request, res: express.Response) {
    if (!req.user) {
        throw new UnauthorizedError("You must sign in before using this service.");
    }
    const newEmail = z.string().email().parse(req.body.email);
    const confirmationToken = await editEmailFunc(req.user, newEmail);
    await sendConfirmEmail(req, newEmail, confirmationToken);
    res.send({});
}
