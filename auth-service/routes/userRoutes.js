import express from "express";
import {
  login,
  logout,
  register,
  updateProfile,
  forgotPassword,
  resetPassword
} from "../controllers/userController.js";
import authenticateToken from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";
import { getCurrentUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", singleUpload, register);
router.post("/login", login);
router.get("/logout", logout);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.post(
  "/profile/update",
  authenticateToken,
  singleUpload,
  updateProfile
);

router.get("/me", authenticateToken, getCurrentUser);

export default router;