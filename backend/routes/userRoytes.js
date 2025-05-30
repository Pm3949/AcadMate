import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
} from "../controllers/UserController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(isAuthenticated, logoutUser);
router.route("/me").get(isAuthenticated, getProfile);
// router.get("/materials", getStudyMaterials);

export default router;
