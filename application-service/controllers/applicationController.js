import Application from "../models/application.js";
import Job from "../models/jobModel.js";
import User from "../models/user.js";
import Company from "../models/company.js";  
import { publishApplyJob } from "../services/applyProducer.js";
import updateStatusCentral from "../utils/statusManager.js"
import mongoose from "mongoose";

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID missing",
      });
    }

    const existing = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already applied to this job",
      });
    }

    const job = await Job.findById(jobId);
    const user = await User.findById(userId);

    if (!job || !user) {
      return res.status(404).json({
        success: false,
        message: "Invalid job or user",
      });
    }

    
    const application = await Application.create({
      job: jobId,
      applicant: userId,
      status: "PENDING",
      score: 0,
    });

    //  Audit log 
    application.auditLogs.push({
      action: "APPLIED",
      previousStatus: null,
      newStatus: "PENDING",
      performedBy: userId,
      note: "Candidate applied for this job",
    });

    //  SAVE AFTER PUSH
    await application.save();

    // job → applications array
    job.applications.push(application._id);
    await job.save();

    // async AI processing
    await publishApplyJob({
      applicationId: application._id,
      jobId,
      userId,
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted. Matching in progress.",
    });

  } catch (error) {
    console.error("APPLY JOB ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { score: -1 } }, // 🔥 rank by score
      populate: {
        path: "applicant",
        select: "fullname email phoneNumber profile ",
      },
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      job,
    });

  } catch (error) {
    console.error("GET APPLICANTS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;

    const applications = await Application.find({
      applicant: userId,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        populate: {
          path: "company",
        },
      });

    return res.status(200).json({
      success: true,
      applications,
    });

  } catch (error) {
    console.error("GET APPLIED JOBS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getApplicationsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({ job: jobId })
      .populate("applicant", "fullname email  profile")
      .sort({ score: -1 }); // 🔥 highest score first

    return res.status(200).json({
      success: true,
      applications,
    });

  } catch (error) {
    console.error("GET APPLICATIONS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const getDashboardApplications = async (req, res) => {
  try {
    const { status, jobId } = req.query;

    let filter = {};

    // ✅ JOB FILTER
    if (
      jobId &&
      jobId !== "null" &&
      jobId !== "undefined" &&
      mongoose.Types.ObjectId.isValid(jobId)
    ) {
      filter.job = jobId;
    }

    // ✅ STATUS FILTER
    if (status && status !== "ALL") {
      filter.status = status;
    }

    const applications = await Application.find(filter)
      .populate("applicant", "fullname email phoneNumber profile")
      .populate("job", "title")
      .sort({ score: -1 });

    return res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("DASHBOARD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["INTERVIEW", "REJECTED", "HIRED"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    application.status = status;
    await application.save();

    return res.status(200).json({
      success: true,
      message: `Application marked as ${status}`,
      application,
    });

  } catch (error) {
    console.error("UPDATE APPLICATION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const scheduleInterview = async (req, res) => {

  try {

    const { id } = req.params;
    const { scheduledAt, mode, type } = req.body;

    const application = await Application.findById(id)
      .populate("applicant", "fullname email")
      .populate({
        path: "job",
        populate: { path: "company", select: "name" }
      });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    const nextRound = application.interview.currentRound + 1;

    application.interview.rounds.push({
      roundNumber: nextRound,
      type,
      scheduledAt,
      mode
    });

    application.interview.currentRound = nextRound;

    await updateStatusCentral({
      application,
      newStatus: "INTERVIEW",
      action: "INTERVIEW_SCHEDULED",
      note: `${type} interview scheduled for round ${nextRound}`,
      performedBy: req.id,
      type,

      candidateEmail: application.applicant.email,
      candidateName: application.applicant.fullname,
      jobTitle: application.job.title,
      companyName: application.job.company.name
    });

    res.json({
      success: true,
      message: "Interview scheduled",
      application
    });

  } catch (error) {

    console.log("Schedule Interview Error:", error);

    res.status(500).json({
      success: false
    });

  }

};


export const interviewDecision = async (req, res) => {

  try {

    const { id } = req.params;
    const { decision } = req.body;

    const application = await Application
      .findById(id)
      .populate("applicant", "fullname email")
      .populate({
        path: "job",
        populate: { path: "company", select: "name" }
      });

    if (!application) {
      return res.status(404).json({ success:false });
    }

    if (application.status !== "INTERVIEW") {
      return res.status(400).json({
        success:false,
        message:"Not in interview stage"
      });
    }

    const totalRounds = application.job.interviewConfig.totalRounds;
    const currentRound = application.interview.currentRound;

    const round =
      application.interview.rounds[currentRound - 1];

    if (decision === "FAIL") {

      round.result = "FAIL";

      await updateStatusCentral({
        application,
        newStatus:"REJECTED",
        action:"INTERVIEW_FAIL",
        note:`Failed ${round.type} round ${currentRound}`,
        performedBy:req.id,
        type: round.type,

        candidateEmail: application.applicant.email,
        candidateName: application.applicant.fullname,
        jobTitle: application.job.title,
        companyName: application.job.company.name
      });

    }

    if (decision === "PASS") {

      round.result = "PASS";

      if (currentRound >= totalRounds) {

        await updateStatusCentral({
          application,
          newStatus:"PASSED",
          action:"PASSED",
          note:`Candidate cleared all interview rounds`,
          performedBy:req.id,
          type: round.type,
          candidateEmail: application.applicant.email,
          candidateName: application.applicant.fullname,
          jobTitle: application.job.title,
          companyName: application.job.company.name
        });

      } 
      else {

        await updateStatusCentral({
          application,
          newStatus:"SHORTLISTED",
          action:"INTERVIEW_PASS",
          note:`Passed ${round.type} round ${currentRound}`,
          performedBy:req.id,
          type: round.type,
          candidateEmail: application.applicant.email,
          candidateName: application.applicant.fullname,
          jobTitle: application.job.title,
          companyName: application.job.company.name
        });

      }

    }

    res.json({
      success:true,
      application
    });

  }
  catch(err){

    console.log("INTERVIEW DECISION ERROR:",err);

    res.status(500).json({ success:false });

  }

};


 export const getAuditLogs = async(req , res)=>{
      const {id} = req.params;
      const application = await Application.findById(id)
      .populate("auditLogs.performedBy" , "fullname  email");

       if(!application){
            return res.status(400).json({success:false});
       }

     return res.json({
         sucess : true,
         auditLogs : application.auditLogs,
     }) 
 }