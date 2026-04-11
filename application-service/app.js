import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import applicationRoutes from "./routes/applicationRoutes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use("/api/application", applicationRoutes);

export default app;