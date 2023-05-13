import {Request, Response} from "express";

export default function logout(req: Request, res: Response) {
    console.log("Logging out.");
    req.logout(() => {
        req.session.destroy(() => {
            res.json({
            })
        });
    });
}
