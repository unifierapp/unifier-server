import express from "express";
import searchProviderAccount from "@/domains/providers/controllers/searchProviderAccount";
import {ensureAuth} from "@/utils/middlewares";
import addProviderAccountToConnection from "@/domains/providers/controllers/addProviderAccountToConnection";
import getOrCreateProviderList from "@/domains/providers/controllers/getOrCreateProviderList";
import resolveProviderAccount from "@/domains/providers/controllers/resolveProviderAccount";
import unlinkProvider from "@/domains/providers/controllers/unlinkProvider";
import getProviders from "@/domains/providers/controllers/getProviders";

const router = express.Router();
router.use(ensureAuth);
router.get("/account/search", searchProviderAccount);
router.get("/account/resolve", resolveProviderAccount);
router.post("/account/add", addProviderAccountToConnection);
router.get("/list", getOrCreateProviderList);
router.delete("/unlink", unlinkProvider);
router.get("/get_all", getProviders);


export default router;