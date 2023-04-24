import dotenv from "dotenv"
import {SessionOptions} from "express-session"
import MongoStore from "connect-mongo";
import process from "process";
import {CorsOptions} from "cors";

dotenv.config({
    path: "./.env"
})

export const PORT = process.env.PORT ?? 8000

export const DB_NAME = "converge"

export const MONGODB_URI = process.env.MONGODB_URI

export const SESSION_CONFIG: SessionOptions = {
    secret: process.env.SESSION_SECRET ?? "GI74SMrgdVea2ltQevYp+VWXd78NIpNH0kiRgWh5yy4=",
    cookie: {
        maxAge: 30 * 1000 * 86400,
        path: "/",
    },
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({
        dbName: DB_NAME,
        mongoUrl: MONGODB_URI,
        touchAfter: 24 * 3600,
        autoRemove: 'interval',
        autoRemoveInterval: 20,
    }),
}

export const CORS_CONFIG: CorsOptions = {
    credentials: true,
    origin: process.env.FRONTEND_URL,
}