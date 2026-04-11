import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import http from "http";

import cookieParser from "cookie-parser";

import userRoutes from "./routes/userRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";

import { connectRabbitMQ } from "./services/rabbit.js";
import { initSocket } from "./notificationService/websocket/socketServer.js";
import { connectNotificationQueue } 
from "./notificationService/notificationProducer.js";

dotenv.config();

const app = express();
const dbPath = process.env.MONGO_URI;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/application", applicationRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/users", userRoutes);

// create HTTP server
const server = http.createServer(app);

// start websocket
initSocket(server);

mongoose
  .connect(dbPath)
  .then(async () => {

    console.log("DB connected");

    // connect rabbitmq producer
    await connectRabbitMQ();
    console.log("RabbitMQ connected");
    
    // notification worker ---
     await connectNotificationQueue();
    console.log("Notification producer connected");

    // start notification worker
    await import("./notificationService/notificationWorker.js");

  })
  .catch((err) => console.log(err));

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});