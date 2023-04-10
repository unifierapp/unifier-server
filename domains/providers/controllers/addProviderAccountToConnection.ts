import {IConnectionAccount} from "@/models/ConnectionAccount";
import express from "express";
import addProviderAccountToConnectionFunction from "@/domains/providers/services/addProviderAccountToConnection";
import {UnauthorizedError} from "@/utils/errors";
import mongoose from "mongoose";
import {urlOrDomainToDomain} from "@/utils/urlHelpers";
import z from "zod";

export default async function addProviderAccountToConnection(req: express.Request, res: express.Response) {
    if (!req.user) {
        throw new UnauthorizedError();
    }
    const providerAccountId = z.string().nonempty().parse(req.body.provider_id);
    const connectionId = z.string().nonempty().parse(req.body.connection_id);
    const provider = z.string().nonempty().parse(req.body.provider);
    let domain = z.string().nonempty().optional().parse(req.body.domain);
    if (domain) {
        domain = urlOrDomainToDomain(domain);
    }
    const object: Omit<IConnectionAccount, "user"> = {
        providerId: providerAccountId,
        connection: new mongoose.Types.ObjectId(connectionId),
        domain: domain,
        provider,
    };
    const result = await addProviderAccountToConnectionFunction(req.user!, object);
    res.send(result);
}
