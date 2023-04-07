import connectionAccount, {IConnectionAccount} from "@/models/ConnectionAccount";
import express from "express";
import addProviderAccountToConnectionFunction from "@/domains/providers/services/addProviderAccountToConnection";
import {BadArgumentError, UnauthorizedError} from "@/utils/errors";
import mongoose from "mongoose";
import {urlOrDomainToDomain} from "@/utils/urlHelpers";

export default async function addProviderAccountToConnection(req: express.Request, res: express.Response) {
    if (!req.user) {
        throw new UnauthorizedError();
    }
    const providerAccountId = req.query.provider_id;
    if (typeof providerAccountId !== 'string') {
        throw new BadArgumentError("Missing provider account ID.");
    }
    const connectionId = req.query.connection;
    if (typeof connectionId !== 'string') {
        throw new BadArgumentError("Missing connection ID.");
    }
    let domain = req.query.domain;
    if (typeof domain !== 'string') {
        throw new BadArgumentError("Invalid domain argument.");
    }
    if (domain) {
        domain = urlOrDomainToDomain(domain);
    }
    const provider = req.query.provider;
    if (typeof provider !== 'string') {
        throw new BadArgumentError("Missing or invalid provider.");
    }
    const object: Omit<IConnectionAccount, "user"> = {
        providerId: providerAccountId,
        connection: new mongoose.Types.ObjectId(connectionId),
        domain: domain,
        provider,
    };
    const result = await addProviderAccountToConnectionFunction(req.user!, object);
    res.send(result.toJSON({virtuals: true}));
}