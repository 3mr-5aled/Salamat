const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const { triageAI, summarizeAI } = require('../controllers/ai.controller');

const rateLimit = require("express-rate-limit");

// Strict Rate Limiter for Gemini AI calls: Max 5 requests per 10 minutes per IP
const aiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // max 5 requests per window per IP
  message: {
    status: "error",
    message: "AI quota rate limit exceeded. Please wait 10 minutes before requesting further AI insights.",
    errorCode: "AI_RATE_LIMIT_EXCEEDED",
  },
});

// Protected routes with strict AI rate limiting
router.post("/triage", protect, aiLimiter, triageAI);
router.post("/summarize", protect, aiLimiter, summarizeAI);

module.exports = router;
