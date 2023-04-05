import express from "express";
import addConnection from "@/domains/connections/services/addConnection";
import {ensureAuth} from "@/utils/middlewares";

const router = express.Router();

router.use(ensureAuth);
router.post("/add", addConnection);

export default router;