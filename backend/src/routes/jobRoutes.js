import express from "express";
import authenticateToken from "../middleware/isAuthenticated.js";
import {
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
  updateJob,
} from "../controllers/jobController.js";

const app = express();

// POST job
app.post("/post", authenticateToken, postJob);

// UPDATE job ✅
app.put("/update/:id", authenticateToken, updateJob);

// GET all jobs
app.get("/get", authenticateToken, getAllJobs);

// GET admin jobs
app.get("/getadminjobs", authenticateToken, getAdminJobs);

// GET job by id
app.get("/get/:id", authenticateToken, getJobById);

export default app;
