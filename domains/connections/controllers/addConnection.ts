import express from "express";
import addConnectionFunction from "@/domains/connections/services/addConnection";
import imageUploader from "@/domains/upload/images";
import {z} from "zod";

export default async function addConnection(req: express.Request, res: express.Response) {
    await new Promise<void>(resolve => {
        const middleware = imageUploader.single("image")
        middleware(req, res, () => {
            resolve()
        });
    })
    const result = await addConnectionFunction(req.user!, {
        birthday: z.date().optional().parse(req.body.birthday),
        displayName: z.string().nonempty().parse(req.body.displayName),
        description: z.string().nonempty().optional().parse(req.body.description),
        image: req.file,
    });
    res.send(result);
}
