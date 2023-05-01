import express from "express";
import getChangelogs from "@/domains/changelogs/controllers/getChangelogs";

const router = express.Router();

router.get("/", getChangelogs)
export default router;