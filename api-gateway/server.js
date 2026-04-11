import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

/* USERS → AUTH SERVICE */

app.use(
  "/api/users",
  createProxyMiddleware({
    target: "http://localhost:4001",
    changeOrigin: true,
    cookieDomainRewrite: "localhost"
  })
);

/* JOB + COMPANY → JOB SERVICE */

app.use(
  "/api/job",
  createProxyMiddleware({
    target: "http://localhost:4002",
    changeOrigin: true
  })
);

app.use(
  "/api/company",
  createProxyMiddleware({
    target: "http://localhost:4002",
    changeOrigin: true
  })
);

/* APPLICATION → APPLICATION SERVICE */

app.use(
  "/api/application",
  createProxyMiddleware({
    target: "http://localhost:4003",
    changeOrigin: true
  })
);

app.listen(3000, () => {
  console.log("🚀 Gateway running on http://localhost:3000");
});