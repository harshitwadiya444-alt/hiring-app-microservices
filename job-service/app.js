import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import jobRoutes from "./routes/jobRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

/* CORS FIRST */
app.use(cors(corsOptions));

/* IMPORTANT: preflight handle */
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

/* BODY PARSER */
app.use(express.json());
app.use(cookieParser());

/* RATE LIMITER */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP address. Please try again later."
  }
});

app.use(limiter);

/* ROUTES */
app.use("/api/job", jobRoutes);
app.use("/api/company", companyRoutes);

export default app;