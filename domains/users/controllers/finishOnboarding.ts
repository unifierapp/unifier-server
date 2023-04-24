import finishOnboardingFunc from "../services/finishOnboarding";
import express from "express";

export default async function finishOnboarding(req: express.Request, res: express.Response) {
    await finishOnboardingFunc(req.user!);
    res.send({});
}