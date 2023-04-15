import express from "express";
import User from "@/models/User";
import {HTTPError} from "@/utils/errors";

export async function signUp (req: express.Request, res: express.Response) {
    const newUser = new User({
        email: req.body.email,
        provider: 'local',
        displayName: req.body.display_name,
    })

    try {
        await User.register(newUser, req.body.password)
    } catch (e) {
        if (e instanceof Error) throw new HTTPError(e.message)
        throw e
    }

    await new Promise<void>((resolve, reject) => req.login(newUser, function (err) {
        if (err) reject(new HTTPError(err.message))
        res.send({
            success: true, data: newUser,
        })
        resolve()
    }))
}

