import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import app from "./app.js";

// start workers
import "./workers/applyConsumer.js";
import "./workers/jobEmbeddingWorker.js";
import "./workers/resumeWorker.js";

// connect DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("AI Service DB connected");

    app.listen(process.env.PORT, () => {
      console.log(`AI Service running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log(err));