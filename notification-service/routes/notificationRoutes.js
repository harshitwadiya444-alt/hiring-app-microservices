
import express from "express";
import { getUserNotifications } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/notifications/:userId", getUserNotifications);

export default router;