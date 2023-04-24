import express from "express";
import getCurrentUser from "./controllers/currentUser";
import finishOnboarding from "@/domains/users/controllers/finishOnboarding";
import {ensureAuth} from "@/utils/middlewares";

const router = express.Router();

router.get("/current", getCurrentUser);

// Private routes start from here.
router.use(ensureAuth);
router.post("/finish_onboarding", finishOnboarding);

export default router;