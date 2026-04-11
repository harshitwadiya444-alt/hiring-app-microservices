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

      const data = JSON.parse(msg.content.toString());

      console.log("Notification Event:", data);

      await pool.query(
        "INSERT INTO notifications(user_id, message) VALUES($1,$2)",
        [data.userId, data.message]
      );

      try {
        await sendEmail(data);
      } catch (err) {
        console.log("Email failed but continuing...");
      }

      sendSocketNotification({
        userId: data.userId,
        message: data.message
      });

      channel.ack(msg);

    } catch (err) {

      console.log("Notification error:", err);

      channel.nack(msg, false, false);

    }

  });

};

startNotificationWorker();