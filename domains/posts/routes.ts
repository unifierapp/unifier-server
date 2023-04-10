import express from "express";
import getPosts from "@/domains/posts/controllers/getPosts";
import {ensureAuth} from "@/utils/middlewares";

const router = express.Router()

router.use(ensureAuth);
router.get("/", getPosts);

export default router;