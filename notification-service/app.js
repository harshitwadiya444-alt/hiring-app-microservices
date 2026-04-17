import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

/* handle preflight requests */
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

/* RATE LIMITER */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP address. Please try again later."
  }
});

app.use(limiter);

export default app;