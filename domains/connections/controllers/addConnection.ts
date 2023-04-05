import express from "express";
import mongoose from "mongoose";
import addConnectionFunction from "@/domains/connections/services/addConnection";
import {IConnection} from "@/models/Connection";

export default async function addConnection(req: express.Request, res: express.Response) {
    // Just let the Mongoose strict mode do its work =)
    const result = await addConnectionFunction(req.query as Partial<IConnection>);
    res.send(result.toJSON({virtuals: true}));
}