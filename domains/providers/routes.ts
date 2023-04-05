import express from "express";
import searchProviderAccount from "@/domains/providers/controllers/searchProviderAccount";
import {ensureAuth} from "@/utils/middlewares";
import addProviderAccountToConnection from "@/domains/providers/controllers/addProviderAccountToConnection";

const router = express.Router();
router.use(ensureAuth);
router.get("/account/search", searchProviderAccount);
router.post("/account/add", addProviderAccountToConnection);

export default router;