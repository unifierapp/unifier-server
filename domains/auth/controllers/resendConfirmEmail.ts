import express from "express";
import {sendConfirmEmail} from "@/domains/auth/services/sendConfirmEmail";
import {UnauthorizedError} from "@/utils/errors";

export default async function resendConfirmEmail(req: express.Request, res: express.Response) {
    if (!req.user) {
        throw new UnauthorizedError("You must log in before using this service.");
    }
    if (!req.user.emailConfirmationKey) {
        throw new UnauthorizedError("You have already been verified.")
    }
    await sendConfirmEmail(req, req.user.newEmail, req.user.emailConfirmationKey);
    res.send({});
}
