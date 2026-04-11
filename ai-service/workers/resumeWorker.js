import amqp from "amqplib";
import fetch from "node-fetch";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { parseResume } from "../services/resumeParser.js";
import { parseResumeWithAI } from "../services/aiResumeParser.js";
import { getResumeEmbedding } from "../services/embeddingService.js";
import User from "../models/user.js";

dotenv.config();

// ---------- DB CONNECT ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Resume Worker DB connected"))
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  });

console.log("🔥 RESUME WORKER FILE LOADED");

// ---------- WORKER ----------
const startWorker = async () => {
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await conn.createChannel();

  await channel.assertQueue("resume_queue", { durable: true });

  console.log("✅ Resume worker running...");
  console.log("🟡 Waiting to consume messages from resume_queue");

  channel.consume("resume_queue", async (msg) => {
    let userId;

    try {
      console.log("\n================ NEW RESUME JOB ================");

      const payload = JSON.parse(msg.content.toString());
      console.log("📩 Queue payload:", payload);

      userId = payload.userId;
      const { resumeUrl } = payload;

      console.log("⬇️ Downloading resume from:", resumeUrl);

      // ---------- DOWNLOAD PDF ----------
      const response = await fetch(resumeUrl);
      const buffer = Buffer.from(await response.arrayBuffer());

      // ---------- RAW PDF PARSE ----------
      const rawText = await parseResume(buffer);

      console.log("\n===== RAW RESUME TEXT START =====");
      console.log(rawText);
      console.log("===== RAW RESUME TEXT END =====\n");

      if (!rawText || rawText.length < 50) {
        throw new Error("Parsed resume text is empty / too small");
      }

      // ---------- AI PARSING ----------
      console.log("🤖 Sending resume text to AI parser...");

      const aiResult = await parseResumeWithAI(rawText);

      console.log("🤖 AI PARSER RAW RESULT:");
      console.log(aiResult);

      const skills = Array.isArray(aiResult.skills) ? aiResult.skills : [];
      const projects = Array.isArray(aiResult.projects)
        ? aiResult.projects
        : [];

      console.log("✅ Extracted SKILLS:", skills);
      console.log("✅ Extracted PROJECTS:", projects);

      // ---------- RESUME TEXT (ONLY AI OUTPUT) ----------
      let resumeText = "SKILLS:\n";
      resumeText += skills.join(" ");
      resumeText += "\n\nPROJECTS:\n";

      for (const p of projects) {
        resumeText += p.name + " ";
        if (p.technologies) resumeText += p.technologies.join(" ") + " ";
        if (p.description) resumeText += p.description + " ";
      }

      console.log("\n🧠 EMBEDDING INPUT TEXT:");
      console.log(resumeText);

      // ---------- EMBEDDING ----------
      const embedding = await getResumeEmbedding(resumeText);
      console.log("📐 Embedding vector length:", embedding?.length);

      // ---------- SAVE TO DB (SCHEMA MATCH) ----------
      await User.findByIdAndUpdate(userId, {
        "profile.resumeText": resumeText,
        "profile.skills": skills,
        "profile.projects": projects,
        "profile.resumeEmbedding": embedding,
        "profile.resumeEmbeddingStatus": "DONE",
      });

      console.log("💾 Resume data saved to DB for user:", userId);

      channel.ack(msg);
      console.log("✅ Queue message ACKED");

    } catch (err) {
      console.error("❌ Resume worker error:", err.message);

      if (userId) {
        await User.findByIdAndUpdate(userId, {
          "profile.resumeEmbeddingStatus": "FAILED",
        });
      }

      channel.nack(msg, false, false);
    }
  });
};

startWorker();
