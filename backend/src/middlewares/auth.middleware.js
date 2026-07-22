const { protect, allowedTo } = require("../controllers/auth.controller");

// Export authentication middleware for easier use in routes
module.exports = {
  protect,
  allowedTo,

  // Role-specific middleware
  adminOnly: allowedTo("admin"),
  doctorOnly: allowedTo("doctor"),
  patientOnly: allowedTo("patient"),
  adminOrDoctor: allowedTo("admin", "doctor"),
  anyAuthenticated: protect,
};
