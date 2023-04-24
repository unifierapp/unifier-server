import getProvidersFunc from "@/domains/providers/services/getProviders";
import express from "express";

export default async function getProviders(req: express.Request, res: express.Response) {
    res.json(await getProvidersFunc(req.user!));
}