import nodemailer from "nodemailer";
import {MAIL_CONFIG} from "@/config";

const transport = nodemailer.createTransport(MAIL_CONFIG);

export async function sendNoReplyEmail(props: { to: string, html: string, subject: string }) {
    const config = {from: process.env.EMAIL_NOREPLY_SENDER, ...props};
    console.log(config, transport);
    await transport.sendMail(config);
}
