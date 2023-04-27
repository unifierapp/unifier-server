import {HTTPError, UnauthorizedError} from "@/utils/errors";
import {AxiosError} from "axios";
import express from "express";

export function ensureAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!req.isAuthenticated()) {
        throw new UnauthorizedError("You must sign in before using the API endpoint.");
    }
    next();
}

export async function errorHandling(e: unknown, request: express.Request, response: express.Response, next: express.NextFunction) {
    console.error(e);
    if (e instanceof HTTPError) {
        // console.log(e.message);
        return response.status(e.httpCode).json({
            message: e.message,
            code: e.code,
        });
    } else if (e instanceof AxiosError) {
        return response.status(500).json({
            message: e.cause,
            code: 'ERROR_INTERNAL_AXIOS_ERROR',
        });
    } else if (e instanceof Error) {
        // console.log(e.message);
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