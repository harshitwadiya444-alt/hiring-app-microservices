import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import applicationRoutes from "./routes/applicationRoutes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP address please try again after 15 minutes"
  }
});

app.use(limiter);

app.use("/api/application", applicationRoutes);

export default app;