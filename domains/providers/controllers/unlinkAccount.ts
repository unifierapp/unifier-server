import express from "express";
import {forceNonEmptyString, forceOptionalNonEmptyString} from "@/utils/typeCheck";

export default function unlinkAccount(req: express.Request, res: express.Response) {
    const provider = forceNonEmptyString(req.body.provider);
    const domain = forceOptionalNonEmptyString(req.body.domain);
}
