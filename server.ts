import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import * as config from "./config";
import activatePassport from "@/domains/auth/passport";
import authRouter from "@/domains/auth/routes"

const app = express()
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.enable('trust proxy')
activatePassport(app)

mongoose.connect(config.MONGODB_URI, {
    dbName: config.DB_NAME
}).then(() => {
    console.log("Successfully connected to MongoDB.")
})

app.use("/auth", authRouter)

export default app