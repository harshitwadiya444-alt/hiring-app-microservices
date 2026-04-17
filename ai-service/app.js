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

/* handle preflight request */
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP address please try again after 15 minutes"
  }
});

app.use(limiter);

app.get("/", (req, res) => {
  res.send("AI Worker Service Running");
});

export default app;

/*
CORS
JSON parser
Rate limiter
Routes
*/ 