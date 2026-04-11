import amqp from "amqplib";
import mongoose from "mongoose";
import dotenv from "dotenv";

import Application from "../models/application.js";
import Job from "../models/jobModel.js";
import User from "../models/user.js";

import { calculateMatch } from "../services/matchingService.js";
import {
  publishStatusUpdate,
  connectNotificationQueue
} from "../notificationService/notificationProducer.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Apply Worker DB connected"))
  .catch((err) => console.log("Mongo error", err));

const startConsumer = async () => {

  await connectNotificationQueue();

  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await conn.createChannel();

  await channel.assertQueue("apply_job", { durable: true });

  console.log("Apply Worker started");

  channel.consume("apply_job", async (msg) => {

    try {

      const { applicationId, jobId, userId } =
        JSON.parse(msg.content.toString());

      const job = await Job.findById(jobId);
      const user = await User.findById(userId);
      const recruiter = await User.findById(job.created_by);

      const resumeText = user.profile?.resumeText || "";

      const result = calculateMatch(
        job.embedding,
        user.profile?.resumeEmbedding,
        resumeText,
        job.requiredSkills || [],
        job.requiredTools || []
      );

      let status;

      if (result.isMatch) status = "SHORTLISTED";
      else if (result.isReview) status = "REVIEW_REQUIRED";
      else status = "REJECTED";

      await Application.findByIdAndUpdate(
        applicationId,
        {
          score: result.score,
          scoreBreakdown: {
            aiScore: result.aiScore,
            ruleScore: result.ruleScore
          },
          matched: result.matched,
          status
        },
        { new: true }
      );

      await publishStatusUpdate({
        userId: user._id.toString(),
        message: `${job.title} application ${status}`,
        status,
        jobTitle: job.title,
        candidateEmail: user.email,
        recruiterEmail: recruiter.email
      });

      channel.ack(msg);

    } catch (err) {

      console.log("Apply Worker error", err);

      channel.nack(msg, false, false);

    }

  });

};

startConsumer();