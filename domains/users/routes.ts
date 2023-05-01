import express from "express";
import getCurrentUser from "./controllers/currentUser";
import finishOnboarding from "@/domains/users/controllers/finishOnboarding";
import {ensureAuth} from "@/utils/middlewares";
import editEmail from "@/domains/users/controllers/editEmail";
import editPassword from "@/domains/users/controllers/editPassword";
import changeProfilePicture from "@/domains/users/controllers/changeProfilePicture";
import deleteProfilePicture from "@/domains/users/controllers/deleteProfilePicture";
import userLookup from "@/domains/users/controllers/userLookup";

const router = express.Router();

router.get("/current", getCurrentUser);
router.patch("/email", editEmail);
router.get("/lookup/:username", userLookup);
// Private routes start from here.
router.use(ensureAuth);
router.patch("/password", editPassword);
router.post("/profile_picture", changeProfilePicture);
router.delete("/profile_picture", deleteProfilePicture);
router.post("/finish_onboarding", finishOnboarding);
export default router;
