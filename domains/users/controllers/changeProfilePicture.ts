import express from "express";
import imageUploader from "@/domains/upload/images";
import {BadArgumentError} from "@/utils/errors";
import changeProfilePictureFunc from "@/domains/users/services/changeProfilePicture";

export default async function changeProfilePicture(req: express.Request, res: express.Response) {
    console.log("Parsing file.");
    await new Promise<void>((resolve, reject) => {
        try {
            imageUploader.single("profile_picture")(req, res, () => resolve);
        } catch (e) {
            reject(e);
        }
    });
    if (!req.file) {
        throw new BadArgumentError("1 picture is required.");
    }
    console.log("File received.");
    await changeProfilePictureFunc(req.user!, req.file);
    res.json({});
}
