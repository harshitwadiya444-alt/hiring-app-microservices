import dotenv from "dotenv";
import http from "http";
import app from "./app.js";

import { initSocket } from "./websocket/socketServer.js";
import "./workers/notificationWorker.js";
import notificationRoutes from "./routes/notificationRoutes.js"

dotenv.config();

const server = http.createServer(app);

// start websocket
initSocket(server);

app.use("/api", notificationRoutes);

server.listen(4004, () => {
  console.log("Notification service running on http://localhost:4004");
});