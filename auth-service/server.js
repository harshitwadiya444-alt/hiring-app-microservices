import dotenv from "dotenv";
import mongoose from "mongoose";

import app from "./app.js";
import { connectRabbitMQ } from "./services/rabbit.js";

dotenv.config();

const PORT = process.env.PORT || 4001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {

    console.log("✅ Auth DB connected");

    await connectRabbitMQ();

    app.listen(PORT, () => {
      console.log(`🚀 Auth Service running on port ${PORT}`);
    });

  })
  .catch((err) => console.log(err));