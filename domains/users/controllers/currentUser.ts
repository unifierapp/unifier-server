import express from "express";

export default function getCurrentUser(req: express.Request, res: express.Response) {
    res.json(req.user);
}