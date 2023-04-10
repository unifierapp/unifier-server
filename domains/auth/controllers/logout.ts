import {Request, Response} from "express";

export default function logout(req: Request, res: Response) {
    req.logout(() => {
        req.session.destroy(() => {
            res.json({
            })
        });
    });
}
