import express from "express";

import authenticateToken from "../middleware/isAuthenticated.js";
import {
  applyJob,
  getApplicants,
  getApplicationsForJob,
  getAppliedJobs,
  getDashboardApplications,
  updateApplicationStatus,
  scheduleInterview,
  interviewDecision,
  getAuditLogs
} from "../controllers/applicationController.js";


const router = express.Router();


router.post("/apply/:id" ,authenticateToken,applyJob);
router.get("/get" ,authenticateToken ,getAppliedJobs);
router.get("/:id/applicants" ,authenticateToken ,getApplicants);
 router.post("/status/:id/update", authenticateToken, updateApplicationStatus);
router.get("/job/:jobId",authenticateToken , getApplicationsForJob);
router.get(
  "/dashboard/applications",
  authenticateToken,
  getDashboardApplications
);
router.post("/:id/schedule-interview" ,authenticateToken , scheduleInterview);
router.post(
  "/:id/interview-decision",authenticateToken,
     interviewDecision
);

router.get("/:id/audit-log",authenticateToken,getAuditLogs);
export default router;