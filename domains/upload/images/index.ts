import multer from "multer";
import express from "express";
import {mimeMatch} from "type-is";
import {BadArgumentError} from "@/utils/errors";

const imageUploader = multer({
    dest: "/tmp",
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter(req: express.Request, file: Express.Multer.File, callback: multer.FileFilterCallback) {
        const mimetype = file.mimetype;
        if (!mimeMatch("image/*", mimetype)) {
            return callback(new BadArgumentError("This filename does not match."));
        }
        callback(null, true);
    }
})

export default imageUploader;