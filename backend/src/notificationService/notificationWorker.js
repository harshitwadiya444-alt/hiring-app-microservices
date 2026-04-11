import amqp from "amqplib";
import dotenv from "dotenv";

import { sendEmail } from "./emailService.js";
import { sendSocketNotification } from "./websocket/socketService.js";

dotenv.config({ path: "../../.env" });

const startNotificationWorker = async () => {

  const conn = await amqp.connect(process.env.RABBITMQ_URL);

  const channel = await conn.createChannel();

  await channel.assertQueue("notifications", { durable: true });

  console.log("Notification Worker started");

  channel.consume("notifications", async (msg) => {

    if (!msg) return;

    try {

      const data = JSON.parse(msg.content.toString());

      console.log("Notification Event:", data);

      // // 📧 EMAIL
      // await sendEmail(data);

     // 🔔 WEBSOCKET POPUP
      sendSocketNotification({
        userId: data.userId,
        message: data.message
      });

      channel.ack(msg);

    } catch (err) {

      console.log("Notification error:", err);

      channel.nack(msg);

    }

  });

};

startNotificationWorker();