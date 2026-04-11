import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/userRoutes.js";

const app = express();

/* CORS */

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true
};

app.use(cors(corsOptions));

/* BODY PARSER */

app.use(express.json());
app.use(cookieParser());

/* ROUTES */

app.use("/api/users", userRoutes);

/* ERROR HANDLER */

app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON" });
  }

  console.error(err);
  res.status(500).json({ message: "Server error" });
});

export default app;