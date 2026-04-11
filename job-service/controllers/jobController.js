
import Job from "../models/jobModel.js";
import { sendToJobQueue } from "../services/jobQueueProducer.js";
import Application from "../models/application.js";


export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      salary,
      location,
      jobType,
      position,
      companyId,

      requiredSkills = [],
      requiredTools = [],
      experienceLevel,
      education,
    } = req.body;

    // ✅ REQUIRED CHECK
    if (
      !title ||
      !description ||
      !salary ||
      !location ||
      !jobType ||
      position === undefined ||
      experienceLevel === undefined ||
      !companyId
    ) {
      return res.status(400).json({
        message: "All required fields must be filled",
        success: false,
      });
    }

    const job = await Job.create({
      title,
      description,
      salary: Number(salary),
      location,
      jobType,
      position: Number(position),
      experienceLevel: Number(experienceLevel),
      requiredSkills,
      requiredTools,
      education: education || "ANY",
      company: companyId,
      created_by: req.id,
      embeddingStatus: "PENDING", // 🔥 optional but recommended
    });
    
    await sendToJobQueue({
       jobId : job._id,
       title,
       description,
       requiredSkills,
       requiredTools,
       experienceLevel,
       education
    })


    return res.status(201).json({
      message: "Job posted successfully",
      job,
      success: true,
    });
  } catch (error) {
    console.error("POST JOB ERROR:", error);
    return res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};



export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    const jobs = await Job.find(query)
      .populate({
        path: "company",
      })
      .sort({ createdAt: -1 });

    if (!jobs) {
      return res.status(404).json({ message: "No jobs found", status: false });
    }
    return res.status(200).json({ jobs, status: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};

export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
    });
    if (!job) {
      return res.status(404).json({ message: "Job not found", status: false });
    }
    return res.status(200).json({ job, status: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};

//admin job created
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId }).populate({
      path: "company",
      sort: { createdAt: -1},
    });
    if (!jobs) {
      return res.status(404).json({ message: "No jobs found", status: false });
    }
    return res.status(200).json({ jobs, status: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};
// UPDATE JOB (ADMIN)
export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      jobType: req.body.jobType,
      education: req.body.education || "ANY",
    };

    if (req.body.salary !== undefined)
      updateData.salary = Number(req.body.salary);

    if (req.body.position !== undefined)
      updateData.position = Number(req.body.position);

    if (req.body.experienceLevel !== undefined)
      updateData.experienceLevel = Number(req.body.experienceLevel);

    if (Array.isArray(req.body.requiredSkills))
      updateData.requiredSkills = req.body.requiredSkills;

    if (Array.isArray(req.body.requiredTools))
      updateData.requiredTools = req.body.requiredTools;

    if (req.body.interviewConfig?.totalRounds !== undefined) {
      updateData.interviewConfig = {
        totalRounds: Number(req.body.interviewConfig.totalRounds),
      };
    }

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    await sendToJobQueue({
      jobId: updatedJob._id,
      title: updatedJob.title,
      description: updatedJob.description,
      requiredSkills: updatedJob.requiredSkills,
      requiredTools: updatedJob.requiredTools,
      experienceLevel: updatedJob.experienceLevel,
      education: updatedJob.education,
    });

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("UPDATE JOB ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};