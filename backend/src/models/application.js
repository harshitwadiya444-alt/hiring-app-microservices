import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
{
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },

  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    
    required: true,
  },

  status: {
    type: String,
    enum: [
      "PENDING",
      "REVIEW_REQUIRED",
      "SHORTLISTED",
      "AUTO_REJECTED",
      "INTERVIEW",
      "PASSED",
      "REJECTED",
    ],
    default: "PENDING",
  },

  score: {
    type: Number,
    min: 0,
    max: 1,
    default: 0,
  },

  scoreBreakdown: {
    aiScore: {
      type: Number,
      min: 0,
      max: 1,
      default: 0,
    },

    ruleScore: {
      type: Number,
      min: 0,
      max: 1,
      default: 0,
    },

    matched: {
      type: [String],
      default: [],
    },

    explanation: {
      type: String,
    },
  },

  interview: {

    currentRound: {
      type: Number,
      default: 0,
    },

    rounds: [
      {
        roundNumber: {
          type: Number,
          required: true,
        },

        type: {
          type: String,
          enum: [
            "DSA",
            "SYSTEM_DESIGN",
            "TECHNICAL",
            "HR",
            "MANAGERIAL",
            "CULTURE_FIT",
          ],
          required: true,
        },

        scheduledAt: {
          type: Date,
        },

        mode: {
          type: String,
          enum: ["ONLINE", "OFFLINE"],
          default: "ONLINE",
        },

        result: {
          type: String,
          enum: ["PASS", "FAIL"],
        },
      },
    ],
  },

  rejection: {
    reason: {
      type: String,
    },

    rejectedAt: {
      type: Date,
    },
  },

  auditLogs: [
    {
      action: {
        type: String,
        enum: [
          "APPLIED",
          "AI_EVALUATED",
          "AUTO_REJECTED",
          "MOVED_TO_REVIEW",
          "SHORTLISTED",
          "INTERVIEW_SCHEDULED",
          "INTERVIEW_PASS",
          "INTERVIEW_FAIL",
          "PASSED",
          "REJECTED",
        ],
        required: true,
      },

      roundNumber: {
        type: Number,
        default: null,
      },

      previousStatus: {
        type: String,
      },

      newStatus: {
        type: String,
      },

      performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      note: {
        type: String,
      },

      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],

},
{ timestamps: true }
);

export default mongoose.model("Application", applicationSchema);