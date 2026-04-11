import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    pancard: {
      type: String,
      required: true,
      unique: true,
    },

    adharcard: {
      type: String,
      required: true,
      unique: true,
    },

    role: {
      type: String,
      enum: ["Student", "Recruiter"],
      default: "Student",
      required: true,
    },

    // ============================
    // PROFILE (MANUAL + AI)
    // ============================
    profile: {
      bio: {
        type: String,
        default: "",
      },

      skills: {
        type: [String],
        default: [],
      },

      education: {
        type: String,
        default: "",
      },

      experience: {
        type: Number,
        default: 0,
      },

      resume: {
        type: String, // Cloudinary URL
        default: "",
      },

      resumeOriginalname: {
        type: String,
        default: "",
      },

      // 🔥 IMPORTANT: EXTRACTED RESUME TEXT
      resumeText: {
        type: String,
        default: "",
      },

      profilePhoto: {
        type: String,
        default: "",
      },

      // 🔥 AI EMBEDDING VECTOR
      resumeEmbedding: {
        type: [Number],
        default: null,
      },

      resumeEmbeddingStatus: {
        type: String,
        enum: ["PENDING", "DONE", "FAILED"],
        default: "PENDING",
      },

      company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        default: null,
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
