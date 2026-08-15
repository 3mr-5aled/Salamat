const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { ApiError } = require("./utils");
const globalErrorHandler = require("./middlewares/error.middleware");
const mountRoutes = require("./routes");

dotenv.config({ path: path.join(__dirname, "../config.env") });

const app = express();
const NODE_ENV = process.env.NODE_ENV || "development";

// Security Middlewares
app.use(helmet());

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim().replace(/\/$/, ""))
  : [];

const defaultAllowedOrigins = [
  "http://localhost:8000",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:3001",
  "https://salamat-medical-system.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.trim().replace(/\/$/, "");

    if (
      allowedOrigins.includes(cleanOrigin) ||
      defaultAllowedOrigins.includes(cleanOrigin) ||
      cleanOrigin.endsWith(".vercel.app") ||
      process.env.NODE_ENV !== "production"
    ) {
      return callback(null, true);
    }

    return callback(new Error(`CORS policy blocked request from origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(cookieParser());
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));

if (NODE_ENV !== "test") {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: NODE_ENV === "development" ? 10000 : 100,
    message: "Too many requests from this IP, please try again after 15 minutes",
  });
  app.use("/api", limiter);
}

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

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Hospital STD API is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

const mongoose = require("mongoose");

// Database Service Availability Check Middleware
app.use("/api", (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      status: "error",
      message: "Database service is currently offline or unreachable. Please verify MongoDB service is running and try again.",
      errorCode: "DATABASE_OFFLINE",
    });
  }
  next();
});

// Mount Routes
mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
