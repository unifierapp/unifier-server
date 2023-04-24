import express from "express";

export default function getCurrentUser(req: express.Request, res: express.Response) {
    const user = req.user;
    if (user) {
        let withPassword = false;
        if (user.hash && user.salt) {
            withPassword = true;
        }
        delete user.hash;
        delete user.salt;
        delete user.attempts;
        res.json({
            ...user.toJSON(),
            withPassword,
        });
    } else {
        res.json(null);
    }
}
