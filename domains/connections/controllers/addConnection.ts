import express from "express";
import addConnectionFunction from "@/domains/connections/services/addConnection";
import {
    forceNonEmptyString,
    forceOptionalDate,
    forceOptionalNonEmptyString,
    forceOptionalString
} from "@/utils/typeCheck";

export default async function addConnection(req: express.Request, res: express.Response) {
    // Just let the Mongoose strict mode do its work =)
    const result = await addConnectionFunction({
        user: req.user!._id,
        birthday: forceOptionalDate(req.body.birthday),
        displayName: forceNonEmptyString(req.body.displayName),
        description: forceOptionalNonEmptyString(req.body.description),
        image: req.file,
    });
    res.send(result.toJSON({virtuals: true}));
}
