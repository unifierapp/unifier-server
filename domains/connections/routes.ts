import express from "express";
import addConnection from "@/domains/connections/controllers/addConnection";
import {ensureAuth} from "@/utils/middlewares";
import editConnection from "@/domains/connections/controllers/editConnection";

const router = express.Router();

router.use(ensureAuth);
router.post("/", addConnection);
router.put("/:id", editConnection);

export default router;