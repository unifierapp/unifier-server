import express from "express";
import User from "@/models/User";

export async function signIn(req: express.Request, res: express.Response) {
    const candidateUser = new User({
        email: req.body.email,
    })

    const {error, user} = await candidateUser.authenticate(req.body.password)

    if (error) {
        if (error.name === 'IncorrectUsernameError') {
            return res.send(
                {
                    success: false,
                    data: {
                        message: 'Username or password are incorrect.'
                    }
                }
            )
        }
    }

    req.login(user, function () {
        return res.send({
            success: true, data: user
        })
    })
}
