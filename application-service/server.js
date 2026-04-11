import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

import { connectRabbitMQ } from "./services/rabbit.js";
import { connectNotificationQueue } from "./services/notificationProducer.js";

dotenv.config();

const PORT = process.env.PORT || 4003;

const startServer = async () => {
  try {

    // MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Application Service DB connected");

    // RabbitMQ base connection
    await connectRabbitMQ();

    // Notification queue setup
    await connectNotificationQueue();

    console.log("RabbitMQ queues ready");

    // Start express server
    app.listen(PORT, () => {
      console.log(`Application Service running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Server start error:", error);
  }
};

startServer();