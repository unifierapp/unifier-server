import express from "express";
import deleteProfilePictureFunc from "../services/deleteProfilePicture";

export default async function deleteProfilePicture(req: express.Request, res: express.Response) {
    await deleteProfilePictureFunc(req.user!);
    res.json({});
}
