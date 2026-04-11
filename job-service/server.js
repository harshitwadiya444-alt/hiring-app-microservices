import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";
import { connectRabbitMQ } from "./services/rabbit.js";

dotenv.config();

const PORT = process.env.PORT || 4002;

const startServer = async () => {
  try {

    // MongoDB connect
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Job Service DB connected");

    // RabbitMQ connect
    await connectRabbitMQ();
    console.log("RabbitMQ connected");

    // Server start
    app.listen(PORT, () => {
      console.log(`Job Service running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("Server start failed:", err);
    process.exit(1);
  }
};

startServer();