import {IConnectionAccount} from "@/models/ConnectionAccount";
import express from "express";
import addProviderAccountToConnectionFunction from "@/domains/providers/services/addProviderAccountToConnection";
import {UnauthorizedError} from "@/utils/errors";

export default async function addProviderAccountToConnection(req: express.Request, res: express.Response) {
    if (!req.user) {
        throw new UnauthorizedError();
    }
    const result = await addProviderAccountToConnectionFunction(req.user, req.query as Partial<IConnectionAccount>);
    res.send(result.toJSON({virtuals: true}));
}