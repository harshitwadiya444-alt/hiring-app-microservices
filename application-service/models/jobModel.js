import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    requirements: {
      type: String,
      default: "",
    },

    salary: {
      type: String,
      required: true,
    },

    experienceLevel: {
      type: Number,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    jobType: {
      type: String,
      required: true,
    },

    position: {
      type: Number,
      required: true,
    },

    requiredSkills: {
      type: [String],
      default: [],
    },

    requiredTools: {
      type: [String],
      default: [],
    },

    minExperience: {
      type: Number,
      default: 0,
    },

    education: {
      type: String,
      enum: ["BCA", "MCA", "BTECH", "ANY"],
      default: "ANY",
    },

    status: {
      type: String,
      enum: ["OPEN", "CLOSED"],
      default: "OPEN",
    },

    // ================= INTERVIEW CONFIG =================
    interviewConfig: {
      totalRounds: {
        type: Number,
        default: 1,
        min: 1,
      },
    },

    // ================= AI EMBEDDING =================
    embedding: {
      type: [Number],
      default: null,
    },

    embeddingStatus: {
      type: String,
      enum: ["PENDING", "DONE", "FAILED"],
      default: "PENDING",
    },

    // ================= RELATIONS =================
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);