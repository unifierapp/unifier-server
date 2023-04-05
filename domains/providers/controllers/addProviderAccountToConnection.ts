import {IConnectionAccount} from "@/models/ConnectionAccount";
import express from "express";
import addProviderAccountToConnectionFunction from "@/domains/providers/services/addProviderAccountToConnection";

export default async function addProviderAccountToConnection(req: express.Request, res: express.Response) {
    const result = await addProviderAccountToConnectionFunction(req.query as Partial<IConnectionAccount>);
    res.send(result.toJSON({virtuals: true}));
}