import express from "express";
import mongoose from "mongoose";
import addConnectionFunction from "@/domains/connections/services/addConnection";
import {IConnection} from "@/models/Connection";

export default async function addConnection(req: express.Request, res: express.Response) {
    // Just let the Mongoose strict mode do its work =)
    const result = await addConnectionFunction({
        user: req.user!._id,
        birthday: req.body.birthday,
        displayName: req.body.displayName,
        description: req.body.description,
        image: req.file,
    });
    res.send(result.toJSON({virtuals: true}));
}