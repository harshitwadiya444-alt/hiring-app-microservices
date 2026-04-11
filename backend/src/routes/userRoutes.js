import express from "express";
import {
  login,
  logout,
  register,
  updateProfile,
} from "../controllers/userController.js";
import authenticateToken from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";
import { getCurrentUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", singleUpload,
register);
router.post("/login",login);
router.get("/logout",logout);
router.post(
  "/profile/update",
  authenticateToken,
  singleUpload,
  updateProfile
);
router.get("/me" , authenticateToken , getCurrentUser);


export default router;