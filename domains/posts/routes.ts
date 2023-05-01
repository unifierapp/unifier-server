import express from "express";
import getPosts from "@/domains/posts/controllers/getPosts";
import getUserTimeline from "@/domains/posts/controllers/getUserTimeline";
import {ensureAuth} from "@/utils/middlewares";

const router = express.Router()

router.use(ensureAuth);
router.get("/", getPosts);
router.get("/user", getUserTimeline);

export default router;