import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

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

/* OTHER MIDDLEWARE */

app.use(express.json());
app.use(cookieParser());

/* ROUTES */

app.use("/api/job", jobRoutes);
app.use("/api/company", companyRoutes);

export default app;