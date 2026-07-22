const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { ApiError } = require("./src/utils");
const globalErrorHandler = require("./src/middlewares/error.middleware");
const mountRoutes = require("./src/routes");
const logger = require("./src/utils/logger.utils");

dotenv.config({ path: path.join(__dirname, "config.env") });
const dbConnection = require("./src/config/database.config");

mongoose.set("strictQuery", false);

// Connect with db
dbConnection();

// express app
const app = express();
// display port and mode
const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Start server
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
});

// Handle rejection outside express
process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Promise Rejection: ${err.name} | ${err.message}`, {
    stack: err.stack,
    event: "unhandledRejection",
  });
  server.close(() => {
    logger.error("Server shutting down due to unhandled promise rejection");
    process.exit(1);
  });
});

// Security Middlewares
// Set security HTTP headers
app.use(helmet());

// Enable CORS (Cross-Origin Resource Sharing)
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : [
          "http://localhost:8000",
          "http://localhost:5173",
          "http://localhost:3000",
          "http://localhost:3001",
        ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-requested-with"],
  })
);

// Cookie parser middleware
app.use(cookieParser());

// Body parser middlewares
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static(path.join(__dirname, "uploads")));

// Limit each IP to 100 requests per `window` (here, per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: NODE_ENV === "development" ? 10000 : 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// Apply the rate limiting middleware to all requests
app.use("/api", limiter);

// Middleware to protect against HTTP Parameter Pollution attacks
app.use(
  hpp({
    whitelist: [
      "sort",
      "fields",
      "page",
      "limit",
      "keyword",
      "allergies",
      "chronicDiseases",
      "availability",
      "specialty",
      "gender",
      "bloodType",
      "minAge",
      "maxAge",
      "allergy",
      "disease",
    ],
  })
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Hospital STD API is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Root endpoint - API information
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to Hospital STD API",
    version: "1.0.0",
    documentation: {
      health: "/health",
      docs: "/docs",
      api: "/api/v1",
      endpoints: {
        auth: "/api/v1/auth",
        doctors: "/api/v1/doctors",
        patients: "/api/v1/patients",
        clinics: "/api/v1/clinics",
      },
    },
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API documentation endpoint
app.get("/docs", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Hospital STD API Documentation",
    version: "1.0.0",
    baseUrl: `${req.protocol}://${req.get("host")}/api/v1`,
    endpoints: {
      auth: {
        signup: "POST /api/v1/auth/signup",
        login: "POST /api/v1/auth/login",
        forgotPassword: "POST /api/v1/auth/forgot-password",
        resetPassword: "PATCH /api/v1/auth/reset-password/:token",
        profile: "GET /api/v1/auth/me",
        updateProfile: "PATCH /api/v1/auth/me",
        changePassword: "PATCH /api/v1/auth/change-password",
      },
      doctors: {
        getAll: "GET /api/v1/doctors",
        getById: "GET /api/v1/doctors/:id",
        create: "POST /api/v1/doctors",
        update: "PATCH /api/v1/doctors/:id",
        delete: "DELETE /api/v1/doctors/:id",
      },
      patients: {
        getAll: "GET /api/v1/patients",
        getById: "GET /api/v1/patients/:id",
        create: "POST /api/v1/patients",
        update: "PATCH /api/v1/patients/:id",
        delete: "DELETE /api/v1/patients/:id",
      },
      clinics: {
        getAll: "GET /api/v1/clinics",
        getById: "GET /api/v1/clinics/:id",
        create: "POST /api/v1/clinics",
        update: "PATCH /api/v1/clinics/:id",
        delete: "DELETE /api/v1/clinics/:id",
      },
    },
    utility: {
      health: "GET /health",
      documentation: "GET /docs",
    },
    timestamp: new Date().toISOString(),
  });
});

// API base route
app.get("/api", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Hospital STD API v1",
    version: "1.0.0",
    availableVersions: ["v1"],
    currentVersion: "/api/v1",
    documentation: "/docs",
    timestamp: new Date().toISOString(),
  });
});

// API v1 base route
app.get("/api/v1", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Hospital STD API v1 Endpoints",
    version: "1.0.0",
    endpoints: {
      auth: "/api/v1/auth",
      doctors: "/api/v1/doctors",
      patients: "/api/v1/patients",
      clinics: "/api/v1/clinics",
    },
    documentation: "/docs",
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
// Use Routes
mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);
