import express from "express";
import getChangelogsFunc from "@/domains/changelogs/service/getChangelogs";

export default async function getChangelogs(req: express.Request, res: express.Response) {
    const documents = await getChangelogsFunc();
    return res.json(documents);
}