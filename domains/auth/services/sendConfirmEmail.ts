import express from "express";

export function sendConfirmEmail(req: express.Request, token: string) {
    const url = `${req.protocol}://${req.get('host')}/auth/confirm_email?token=${token}`;
    console.log(url);
}
