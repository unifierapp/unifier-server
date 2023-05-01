import express from "express";
import z from "zod";
import {BadArgumentError, NotFoundError} from "@/utils/errors";
import userLookupFunc from "@/domains/users/services/userLookup";
import userAccountLookupFunc from "@/domains/users/services/userAccountLookup";
import {IUser} from "@/models/User";
import {HydratedDocument} from "mongoose";
import {IAccount} from "@/models/Account";

function sanitizeUser(user: IUser) {
    const sanitized = user.toJSON<Partial<IUser>>();
    delete sanitized.hash;
    delete sanitized.salt;
    delete sanitized.attempts;
    delete sanitized.emailConfirmationKey;
    delete sanitized.emailVerified;
    delete sanitized.newEmail;
    delete sanitized.profilePictureCloudId;
    delete sanitized.onboarded;
    return sanitized;
}
function sanitizeAccount(account: HydratedDocument<IAccount>) {
    const sanitized = account.toJSON<Partial<IAccount>>();
    delete sanitized.accessToken;
    delete sanitized.accessTokenSecret;
    delete sanitized.refreshToken;
    delete sanitized.internalListId;
    return sanitized;
}

export default async function userLookup(req: express.Request, res: express.Response) {
    let username: string;
    try {
        username = z.string().parse(req.params.username);
    } catch (e) {
        throw new BadArgumentError("Lookup is invalid.");
    }
    if (!username) {
        throw new NotFoundError("Missing username");
    }
    let user = await userLookupFunc(username);
    let accounts = await userAccountLookupFunc(user);
    let sanitizedAccounts = accounts.map(account => sanitizeAccount(account));
    let sanitizedUser = sanitizeUser(user);
    res.json({
        user: sanitizedUser,
        accounts: sanitizedAccounts,
    });
}


