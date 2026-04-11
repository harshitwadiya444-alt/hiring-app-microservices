import express from "express";
import authenticateToken from "../middleware/isAuthenticated.js";
import {
  getAllCompanies,
  getCompanyById,
  registerCompany,
  updateCompany
} from "../controllers/companyController.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.post("/register", authenticateToken, registerCompany);
router.get("/get", authenticateToken, getAllCompanies);
router.get("/get/:id", authenticateToken, getCompanyById);
router.put("/update/:id", authenticateToken, singleUpload, updateCompany);

export default router;
