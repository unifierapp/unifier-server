import cors from "cors";
import express from "express";
import "express-async-errors";
import mongoose from "mongoose";
import morgan from "morgan";

import * as config from "./config";

import activatePassport from "@/domains/auth/passport";
import authRouter from "@/domains/auth/routes";
import providerRouter from "@/domains/providers/routes";
import connectionRouter from "@/domains/connections/routes";
import postRouter from "@/domains/posts/routes";
import userRouter from "@/domains/users/routes";

import { errorHandling } from "@/utils/middlewares";

const app = express();
app.use(cors(config.CORS_CONFIG));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.enable("trust proxy");
activatePassport(app);

mongoose
	.connect(config.MONGODB_URI, {
		dbName: config.DB_NAME,
	})
	.then(() => {
		console.log("Successfully connected to MongoDB.");
	});

app.use("/auth", authRouter);
app.use("/provider", providerRouter);
app.use("/connection", connectionRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);

app.use(errorHandling);

export default app;
