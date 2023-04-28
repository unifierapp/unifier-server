import express from "express";
import {sendConfirmEmail} from "@/domains/auth/services/sendConfirmEmail";
import {UnauthorizedError} from "@/utils/errors";
import crypto from "crypto";

export default async function resendConfirmEmail(req: express.Request, res: express.Response) {
    if (!req.user) {
        throw new UnauthorizedError("You must log in before using this service.");
    }
    if (!req.user.emailVerified && req.user.newEmail !== req.user.email) {
        throw new UnauthorizedError("You have already been verified.");
    }
    if (!req.user.newEmail) {
        req.user.newEmail = req.user.email;
    }
    if (!req.user.emailConfirmationKey) {
        req.user.emailConfirmationKey = crypto.randomBytes(32).toString("hex");
    }
    await req.user.save();
    await sendConfirmEmail(req, req.user.newEmail, req.user.emailConfirmationKey);
    res.send({});
}
