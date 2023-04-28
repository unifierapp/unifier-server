import nodemailer from "nodemailer";
import {MAIL_CONFIG} from "@/config";

const transport = nodemailer.createTransport(MAIL_CONFIG);

export async function sendNoReplyEmail(props: { to: string, html: string, subject: string }) {
    await transport.sendMail({from: process.env.EMAIL_NOREPLY_SENDER, ...props});
}
