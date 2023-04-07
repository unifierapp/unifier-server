import express from "express";
import searchProviderAccount from "@/domains/providers/controllers/searchProviderAccount";
import {ensureAuth} from "@/utils/middlewares";
import addProviderAccountToConnection from "@/domains/providers/controllers/addProviderAccountToConnection";
import getOrCreateProviderList from "@/domains/providers/controllers/getOrCreateProviderList";

const router = express.Router();
router.use(ensureAuth);
router.get("/account/search", searchProviderAccount);
router.post("/account/add", addProviderAccountToConnection);
router.get("/list", getOrCreateProviderList);

export default router;