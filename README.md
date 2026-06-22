# Hiring App Microservices Platform

## Overview

**Hiring App** is aplication management, notifications, and AI-powered resume processing.

## What This App Does microservice-based hiring platform built for recruiters, job seekers, and employers. It combines a React frontend with a set of backend services that handle authentication, job listings, ap

This project enables a complete hiring workflow:

- Candidates register, login, and upload resumes.
- Employers create and manage jobs and company profiles.
- Users submit applications and track application status.
- Notifications are delivered via email and WebSockets.
- AI workers parse resumes, generate embeddings, and match candidates to jobs.

## Microservice Architecture

The project uses a distributed microservice architecture with the following active services:

- `frontend` — React UI for users and employers
- `auth-service` — user authentication, registration, profile, and resume upload
- `job-service` — job posting and company management
- `application-service` — application submission, status changes, and queueing
- `notification-service` — real-time notifications, email delivery, and WebSocket support
- `ai-service` — resume parsing, embedding creation, and matching logic

Supporting infrastructure includes:

- MongoDB for primary data storage
- RabbitMQ for asynchronous messaging and worker coordination
- PostgreSQL for notification persistence when using Docker Compose

## Folder Structure

```
frontend/
auth-service/
job-service/
application-service/
notification-service/
ai-service/
docker-compose.yml
```

## Service Explanations

### frontend

The React frontend is built with Vite and provides the main user interface. It communicates with the backend services over HTTP and handles routing, forms, candidate dashboards, employer dashboards, and notification UI.

### auth-service

Handles user authentication and profile management. Responsibilities include:

- Register and login users
- JWT token handling and protected routes
- User profile updates
- Resume upload and file handling
- Publishing resume events to RabbitMQ for AI processing

### job-service

Handles job listings and company-related data. Responsibilities include:

- Create, update, and delete job posts
- Manage company profile data
- Publish job events to RabbitMQ for AI embedding and matching

### application-service

Handles job application workflows. Responsibilities include:

- Submit and manage job applications
- Read applications and applicant data
- Update application status and interview results
- Publish application events into RabbitMQ for notifications and AI matching

### notification-service

Handles notification delivery and real-time updates. Responsibilities include:

- Send email notifications to applicants and employers
- Support WebSocket connections for live notifications
- Persist notifications to PostgreSQL (Docker Compose setup)

### ai-service

Runs asynchronous AI workers and processing logic. Responsibilities include:

- Parse resumes using document parsing and AI services
- Generate embeddings for resumes and jobs
- Compute candidate-job matching scores
- Consume RabbitMQ queues for resume, application, and job events

## Tech Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS
- Backend: Node.js, Express, Mongoose, MongoDB
- Messaging: RabbitMQ, amqplib
- AI/Processing: custom resume parsing, embedding generation, matching service
- Notifications: Socket.IO, Nodemailer, PostgreSQL
- Deployment: Docker Compose

## Prerequisites

- Node.js 18+ installed locally
- MongoDB running locally or accessible via connection string
- RabbitMQ running locally or accessible via connection string
- Docker and Docker Compose (optional, recommended for full local deployment)

> Note: `notification-service` also depends on PostgreSQL in the Docker Compose setup.

## Environment Variables

Each service reads configuration from `.env` files or environment variables.

### auth-service

- `PORT` — service port (default `4001`)
- `MONGO_URI` — MongoDB connection string
- `RABBITMQ_URL` — RabbitMQ connection URL
- `JWT_SECRET` — JWT signing secret
- `CLOUD_NAME` — Cloudinary cloud name
- `CLOUD_API_KEY` — Cloudinary API key
- `CLOUD_API_SECRET` — Cloudinary API secret

### job-service

- `PORT` — service port (default `4002`)
- `MONGO_URI` — MongoDB connection string
- `RABBITMQ_URL` — RabbitMQ connection URL
- `JWT_SECRET` — JWT signing secret
- `CLOUD_NAME` — Cloudinary cloud name
- `CLOUD_API_KEY` — Cloudinary API key
- `CLOUD_API_SECRET` — Cloudinary API secret

### application-service

- `PORT` — service port (default `4003`)
- `MONGO_URI` — MongoDB connection string
- `RABBITMQ_URL` — RabbitMQ connection URL
- `JWT_SECRET` — JWT signing secret

### notification-service

- `RABBITMQ_URL` — RabbitMQ connection URL
- `EMAIL_USER` — SMTP email username
- `EMAIL_PASS` — SMTP email password

> Note: `notification-service` currently listens on port `4004` in code and the PostgreSQL connection details are configured inside `notification-service/db/postgres.js`.

### ai-service

- `PORT` — service port (default `4005`)
- `MONGO_URI` — MongoDB connection string
- `RABBITMQ_URL` — RabbitMQ connection URL
- `OPENROUTER_API_KEY` — OpenRouter API key for AI resume parsing
- `OPENROUTER_MODEL` — OpenRouter model name

### frontend

- No required backend environment variables were detected in source files.

## Run Locally Without Docker

1. Install dependencies in each folder:

```bash
cd frontend && npm install
cd ../auth-service && npm install
cd ../job-service && npm install
cd ../application-service && npm install
cd ../notification-service && npm install
cd ../ai-service && npm install
```

2. Start services in separate terminals:

```bash
cd frontend && npm run dev
cd auth-service && npm start
cd job-service && npm start
cd application-service && npm start
cd notification-service && npm start
cd ai-service && npm start
```

3. Ensure supporting services are running:

- MongoDB on `mongodb://127.0.0.1:27017`
- RabbitMQ on `amqp://127.0.0.1:5672`
- PostgreSQL if notifications are used (default `5432` with Docker Compose values)

## Run With Docker Compose

From the repository root:

```bash
docker compose up --build
```

This command starts:

- RabbitMQ
- MongoDB
- PostgreSQL
- auth-service
- job-service
- application-service
- notification-service
- ai-service
- frontend

To stop the stack:

```bash
docker compose down
```

## Ports Table

| Service | Local Port | Docker Compose Port | Description |
|---|---|---|---|
| Frontend | `5173` | `5173` → `80` | React UI |
| auth-service | `4001` | `4001` | Authentication and user profile |
| job-service | `4002` | `4002` | Job and company management |
| application-service | `4003` | `4003` | Application workflows |
| notification-service | `4004` | `4004` | Notifications and WebSockets |
| ai-service | `4005` | `4005` | Resume parsing, embeddings, matching |
| RabbitMQ | `5672` | `5672` | Message broker |
| RabbitMQ UI | `15672` | `15672` | Management console |
| MongoDB | `27017` | `27017` | Primary document database |
| PostgreSQL | `5432` | `5432` | Notification persistence |

## Common Development Issues

### CORS

- Services use CORS restrictions based on the frontend origin.
- `frontend` runs on `http://localhost:5173` by default.
- Some services also whitelist `http://localhost:5174`; verify origin settings in `*.js` service files if you change ports.
- If you get CORS errors, update the service `cors` options or launch the frontend on the expected origin.

### RabbitMQ Connection

- Ensure RabbitMQ is running before starting services that require it.
- Use `RABBITMQ_URL=amqp://localhost:5672` locally.
- When using Docker Compose, use `amqp://rabbitmq:5672` from inside containers.
- If a service cannot connect, check container startup order and RabbitMQ credentials.

### MongoDB Connection

- Ensure `MONGO_URI` points to a running MongoDB instance.
- For local development, use `mongodb://127.0.0.1:27017/<dbname>`.
- When running in Docker, use `mongodb://mongo:27017/<dbname>` from service containers.
- If services fail to connect, verify MongoDB is listening on the expected port and the URI is valid.

## Deployment Notes

- Docker Compose is the recommended deployment path for a complete local stack.
- For production, deploy each service separately behind a reverse proxy or API gateway.
- Ensure environment variables are managed securely and secrets are never committed to source control.
- Use managed RabbitMQ and MongoDB services in production when possible.
- Review `notification-service/db/postgres.js` if you need PostgreSQL credentials or host customization.

## Future Improvements

- Add shared API documentation or OpenAPI specs for each service
- Add environment variable support for `notification-service` PostgreSQL settings
- Add unit and integration tests for backend services
- Add health checks and readiness probes for container orchestration
- Add a production-ready API gateway for routing and authentication
- Add frontend environment configuration for service endpoints
