import express from "express";
import {sendNoReplyEmail} from "@/domains/emails";

export async function sendConfirmEmail(req: express.Request, email: string, token: string): Promise<void> {
    const url = `${req.protocol}://${req.get('host')}/auth/confirm_email?token=${token}`;
    await sendNoReplyEmail({
        to: email,
        html: `<html lang="en">
    <head>
        <title>Verify your email on Unifier</title>
    </head>
    <body>
        <p>
            Click on <a href="${url}">this link</a> to verify on Unifier. If you do not request this, you can safely ignore this email. 
        </p>
    </body>
</html>`,
        subject: "Verify your email on Unifier"
    })
}
