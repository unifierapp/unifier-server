import express from "express";
import {BadArgumentError} from "@/utils/errors";
import z from "zod";
import editPasswordFunc from "@/domains/users/services/editPassword";

export default async function editPassword(req: express.Request<{
    old_password?: string,
    new_password: string,
    confirm_password: string,
}>, res: express.Response) {
    const oldPassword = z.string().optional().parse(req.body.old_password);
    const newPassword = z.string().parse(req.body.new_password);
    const confirmedPassword = z.string().parse(req.body.confirm_password);
    const user = req.user!;
    await editPasswordFunc(user, {
        oldPassword, newPassword, confirmedPassword,
    });
    res.send({});
}
