import {HTTPError, UnauthorizedError} from "@/utils/errors";
import {AxiosError} from "axios";
import express from "express";

export function ensureAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!req.user) {
        throw new UnauthorizedError("You must sign in before using the API endpoint.");
    }
    if (!req.user.emailVerified) {
        const e = new UnauthorizedError("You must verify your email before using the service.");
        e.code = "ERROR_EMAIL_UNVERIFIED";
        throw e;
    }
    next();
}

export async function errorHandling(e: unknown, request: express.Request, response: express.Response, next: express.NextFunction) {
    if (e instanceof HTTPError) {
        console.error(e);
        return response.status(e.httpCode).json({
            message: e.message,
            code: e.code,
        });
    } else if (e instanceof AxiosError) {
        console.error(e.response?.data);
        return response.status(500).json({
            message: e.cause,
            code: 'ERROR_INTERNAL_AXIOS_ERROR',
        });
    } else if (e instanceof Error) {
        console.error(e);
        return response.status(500).json({
            message: e.message,
            code: 'ERROR_INTERNAL_SERVER_ERROR',
        });
    } else {
        return response.status(500).json({
            message: 'Server error.',
            code: 'ERROR_UNKNOWN',
        });
    }
}