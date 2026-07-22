const winston = require("winston");

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

// Tell winston to use these colors
winston.addColors(colors);

// Define log format
const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define which transports the logger must use
const transports = [
  // Console transport
  new winston.transports.Console(),
  // File transport for errors
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
  }),
  // File transport for all logs
  new winston.transports.File({ filename: "logs/all.log" }),
];

// Create the logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "warn" : "debug",
  levels,
  format,
  transports,
});

module.exports = logger;
