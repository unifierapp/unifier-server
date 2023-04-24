import express from "express";

export default function getCurrentUser(req: express.Request, res: express.Response) {
    const user = req.user;
    if (user) {
        delete user.hash;
        delete user.salt;
        res.json(user);
    }
    else {
        res.json(null);
    }
}
