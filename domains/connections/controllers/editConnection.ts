import express from "express";
import imageUploader from "@/domains/upload/images";
import editConnectionFunc from "@/domains/connections/services/editConnection";
import {z} from "zod";

export default async function editConnection(req: express.Request, res: express.Response) {
    await new Promise<void>(resolve => {
        const middleware = imageUploader.single("image")
        middleware(req, res, () => {
            resolve()
        });
    })
    const result = await editConnectionFunc(req.user!, z.string().nonempty().parse(req.params.id), {
        birthday: z.date().optional().parse(req.body.birthday),
        displayName: z.string().nonempty().parse(req.body.displayName),
        description: z.string().nonempty().optional().parse(req.body.description),
        image: req.file,
    });
    res.send(result);
}