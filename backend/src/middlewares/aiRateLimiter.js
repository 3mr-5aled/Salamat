const rateLimit = require('express-rate-limit');

// Configure rate limiting for AI endpoints.
// Limits can be overridden via environment variables for production tuning.
//   AI_RATE_WINDOW_MS: time window in milliseconds (default 60,000 ms = 1 minute)
//   AI_RATE_MAX: max requests per window per IP (default 30)
//   AI_RATE_MESSAGE: response message when limit exceeded.

const windowMs = parseInt(process.env.AI_RATE_WINDOW_MS, 10) || 60 * 1000; // 1 minute
const maxRequests = parseInt(process.env.AI_RATE_MAX, 10) || 30; // 30 requests per window
const message = process.env.AI_RATE_MESSAGE || 'Too many AI requests, please try again later.';

const aiRateLimiter = rateLimit({
  windowMs,
  max: maxRequests,
  message,
  standardHeaders: true,
  legacyHeaders: false,
  // Optional: skip rate limiting for internal trusted calls (e.g., from localhost)
  skip: (req) => {
    // In development, you might want to disable rate limiting.
    if (process.env.NODE_ENV !== 'production') return true;
    return false;
  },
});

module.exports = aiRateLimiter;
