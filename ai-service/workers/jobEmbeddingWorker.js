import amqp from "amqplib";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Job from "../models/jobModel.js";
import { getResumeEmbedding } from "../services/embeddingService.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Job Worker DB connected"))
  .catch((err) => {
    console.error("Job Worker DB failed:", err.message);
    process.exit(1);
  });

const startJobWorker = async () => {
  try {
    const conn = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await conn.createChannel();

    await channel.assertQueue("job_queue", { durable: true });

    console.log("Job Embedding Worker started");

    channel.consume("job_queue", async (msg) => {
      try {
        const {
          jobId,
          title,
          description,
          requiredSkills,
          requiredTools,
          experienceLevel,
          education,
        } = JSON.parse(msg.content.toString());

        const existingJob = await Job.findById(jobId);

        if (!existingJob) {
          channel.ack(msg);
          return;
        }

        if (
          existingJob.embedding &&
          existingJob.embeddingStatus === "DONE"
        ) {
          console.log("Embedding already exists. Skipping...");
          channel.ack(msg);
          return;
        }

        const embeddingText = `
Job Title: ${title}
Description: ${description}
Skills: ${requiredSkills.join(", ")}
Tools: ${requiredTools.join(", ")}
Experience: ${experienceLevel} years
Education: ${education}
        `;

        const embedding = await getResumeEmbedding(embeddingText);

        await Job.findByIdAndUpdate(jobId, {
          embedding,
          embeddingStatus: "DONE",
        });

        channel.ack(msg);
      } catch (err) {
        console.error("Job Worker error:", err.message);
        channel.nack(msg, false, false);
      }
    });
  } catch (err) {
    console.error("RabbitMQ connection failed:", err.message);
    process.exit(1);
  }
};

startJobWorker();