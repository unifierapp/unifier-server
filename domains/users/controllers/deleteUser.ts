import express from "express";
import User from "@/models/User";
import deleteUserFunc from "@/domains/users/services/deleteUser";
export default async function deleteUser(req: express.Request, res: express.Response) {
    await deleteUserFunc(req.user!);
    res.send({});
}