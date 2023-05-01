import dotenv from "dotenv";
import { SessionOptions } from "express-session";
import MongoStore from "connect-mongo";
import { CorsOptions } from "cors";
import SMTPTransport from "nodemailer/lib/smtp-transport";

dotenv.config({
	path: "./.env",
});

export const PORT = process.env.PORT ?? 443;
// @TODO: Change to conditional/environment variable for test db
export const DB_NAME = "unifier";
export const MONGODB_URI = process.env.MONGODB_URI;
export const SESSION_CONFIG: SessionOptions = {
	secret:
		process.env.SESSION_SECRET ??
		// @TODO: Should be environment variable?
		"GI74SMrgdVea2ltQevYp+VWXd78NIpNH0kiRgWh5yy4=",
	cookie: {
		// @FIXME: Can be a single integer with documentation for this number
		maxAge: 30 * 1000 * 86400,
		path: "/",
	},
	saveUninitialized: false,
	resave: false,
	store: new MongoStore({
		dbName: DB_NAME,
		mongoUrl: MONGODB_URI,
		// @FIXME: Can be a single integer with documentation for this number
		touchAfter: 24 * 3600,
		autoRemove: "interval",
		autoRemoveInterval: 20,
	}),
};

export const CORS_CONFIG: CorsOptions = {
	credentials: true,
	origin: process.env.FRONTEND_URL,
};

export const MAIL_CONFIG: SMTPTransport.Options = {
	host: process.env.EMAIL_HOST,
	auth: {
		user: process.env.EMAIL_ACCOUNT,
		pass: process.env.EMAIL_PASSWORD,
	},
	port: 587,
	tls: {
		rejectUnauthorized: true,
		minVersion: "TLSv1.3",
	},
};
