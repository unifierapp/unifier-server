import express from "express";
import getCurrentUser from "./controllers/currentUser";
import finishOnboarding from "@/domains/users/controllers/finishOnboarding";
import {ensureAuth} from "@/utils/middlewares";
import editEmail from "@/domains/users/controllers/editEmail";
import editPassword from "@/domains/users/controllers/editPassword";

const router = express.Router();

router.get("/current", getCurrentUser);
router.patch("/email", editEmail);
// Private routes start from here.
router.use(ensureAuth);
router.patch("/password", editPassword);
router.post("/finish_onboarding", finishOnboarding);

export default router;
