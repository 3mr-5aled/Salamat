const express = require("express");

const {
  signup,
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
  changePassword,
  protect,
  allowedTo,
  getMe,
  updateMe,
  contactAdmin,
  verifyEmail,
  resendVerificationEmail,
  getAdminMessages,
  markAdminMessageAsRead,
  markAllAdminMessagesAsRead,
  // logout,
} = require("../controllers/auth.controller");

const {
  signupValidator,
  loginValidator,
  forgotPasswordValidator,
  verifyResetCodeValidator,
  resetPasswordValidator,
  changePasswordValidator,
} = require("../validators/auth.validators");

const router = express.Router();

const rateLimit = require("express-rate-limit");

// Strict auth rate limiter for login & signup: max 10 attempts per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    status: "error",
    message: "Too many authentication attempts from this IP. Please try again after 15 minutes.",
    errorCode: "AUTH_RATE_LIMIT_EXCEEDED",
  },
});

// Public routes
router.post("/signup", authLimiter, signupValidator, signup);
router.post("/login", authLimiter, loginValidator, login);
router.post("/forgot-password", authLimiter, forgotPasswordValidator, forgotPassword);
router.post("/verifyResetCode", verifyResetCodeValidator, verifyPassResetCode);
router.post("/reset-password", resetPasswordValidator, resetPassword);
router.post("/verify-email", verifyEmail);

// Protected routes (require authentication)
router.use(protect); // All routes after this middleware are protected

router.get("/me", getMe);
router.patch("/me", updateMe);
router.patch("/change-password", changePasswordValidator, changePassword);
router.post("/contact-admin", allowedTo("doctor", "patient"), contactAdmin);
router.post("/resend-verification", resendVerificationEmail);
// router.post("/logout", logout);

// Admin only routes
router.get("/admin-messages", allowedTo("admin"), getAdminMessages);
router.patch("/admin-messages/read-all", allowedTo("admin"), markAllAdminMessagesAsRead);
router.patch("/admin-messages/:id/read", allowedTo("admin"), markAdminMessageAsRead);

router.get("/admin/users", allowedTo("admin"), (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Admin access granted - users list endpoint",
  });
});

module.exports = router;
