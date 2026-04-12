import amqp from "amqplib";
import dotenv from "dotenv";
import pool from "../db/postgres.js";

import { sendEmail } from "../email/emailService.js";
import { sendSocketNotification } from "../websocket/socketService.js";

dotenv.config();

const startNotificationWorker = async () => {

  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await conn.createChannel();

  await channel.assertQueue("notifications", { durable: true });

  channel.prefetch(5);

  console.log("Notification Worker started");

  channel.consume("notifications", async (msg) => {

    if (!msg) return;

    try {

      // Parse RabbitMQ message
      const data = JSON.parse(msg.content.toString());

      console.log("Notification Event:", data);

      let userId = data.userId;

      // Case 1: if userId is an object
      if (typeof userId === "object" && userId._id) {
        userId = userId._id.toString();
      }

      // Case 2: if userId is a string containing ObjectId(...)
      if (typeof userId === "string" && userId.includes("ObjectId")) {
        const match = userId.match(/ObjectId\('([a-f0-9]+)'\)/);
        if (match) {
          userId = match[1];
        }
      }

      // Save notification in PostgreSQL
      await pool.query(
        "INSERT INTO notifications(user_id, message) VALUES($1,$2)",
        [userId, data.message]
      );

      // Send Email
      try {
        await sendEmail(data);
      } catch (err) {
        console.log("Email failed but continuing...");
      }

      // Send WebSocket Notification
      sendSocketNotification({
        userId: userId,
        message: data.message
      });

      // Acknowledge RabbitMQ message
      channel.ack(msg);

    } catch (err) {

      console.log("Notification error:", err);

      // Reject message without requeue
      channel.nack(msg, false, false);

    }

  });

};

startNotificationWorker();