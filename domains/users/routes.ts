import express from "express";
import getCurrentUser from "./controllers/currentUser";
import finishOnboarding from "@/domains/users/controllers/finishOnboarding";
import {ensureAuth} from "@/utils/middlewares";
import editEmail from "@/domains/users/controllers/editEmail";
import editPassword from "@/domains/users/controllers/editPassword";
import changeProfilePicture from "@/domains/users/controllers/changeProfilePicture";
import deleteProfilePicture from "@/domains/users/controllers/deleteProfilePicture";
import userLookup from "@/domains/users/controllers/userLookup";
import deleteUser from "@/domains/users/controllers/deleteUser";

const router = express.Router();

router.get("/current", getCurrentUser);
router.patch("/email", editEmail);
router.get("/lookup/:username", userLookup);
router.patch("/password", ensureAuth, editPassword);
router.delete("/", ensureAuth, deleteUser);
router.post("/profile_picture", ensureAuth, changeProfilePicture);
router.delete("/profile_picture", ensureAuth, deleteProfilePicture);
router.post("/finish_onboarding", ensureAuth, finishOnboarding);

export default router;
