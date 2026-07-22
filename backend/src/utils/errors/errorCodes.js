/**
 * Standard error codes used throughout the application
 */

// Authentication & Authorization Errors (1000-1999)
const AUTH_ERRORS = {
  INVALID_CREDENTIALS: {
    code: 1001,
    message: "Invalid email or password",
    statusCode: 401,
  },
  ACCOUNT_LOCKED: {
    code: 1002,
    message: "Account has been locked due to multiple failed login attempts",
    statusCode: 401,
  },
  TOKEN_EXPIRED: {
    code: 1003,
    message: "Authentication token has expired",
    statusCode: 401,
  },
  INVALID_TOKEN: {
    code: 1004,
    message: "Invalid authentication token",
    statusCode: 401,
  },
  INSUFFICIENT_PERMISSIONS: {
    code: 1005,
    message: "Insufficient permissions to access this resource",
    statusCode: 403,
  },
  EMAIL_NOT_VERIFIED: {
    code: 1006,
    message: "Email address must be verified before accessing this resource",
    statusCode: 403,
  },
};

// Validation Errors (2000-2999)
const VALIDATION_ERRORS = {
  REQUIRED_FIELD_MISSING: {
    code: 2001,
    message: "Required field is missing",
    statusCode: 400,
  },
  INVALID_EMAIL_FORMAT: {
    code: 2002,
    message: "Invalid email address format",
    statusCode: 400,
  },
  INVALID_PHONE_FORMAT: {
    code: 2003,
    message: "Invalid phone number format",
    statusCode: 400,
  },
  PASSWORD_TOO_WEAK: {
    code: 2004,
    message: "Password does not meet security requirements",
    statusCode: 400,
  },
  INVALID_DATE_FORMAT: {
    code: 2005,
    message: "Invalid date format",
    statusCode: 400,
  },
  INVALID_ID_FORMAT: {
    code: 2006,
    message: "Invalid ID format",
    statusCode: 400,
  },
  FILE_TOO_LARGE: {
    code: 2007,
    message: "File size exceeds maximum allowed limit",
    statusCode: 400,
  },
  UNSUPPORTED_FILE_TYPE: {
    code: 2008,
    message: "File type is not supported",
    statusCode: 400,
  },
};

// Resource Errors (3000-3999)
const RESOURCE_ERRORS = {
  USER_NOT_FOUND: {
    code: 3001,
    message: "User not found",
    statusCode: 404,
  },
  PATIENT_NOT_FOUND: {
    code: 3002,
    message: "Patient not found",
    statusCode: 404,
  },
  DOCTOR_NOT_FOUND: {
    code: 3003,
    message: "Doctor not found",
    statusCode: 404,
  },
  APPOINTMENT_NOT_FOUND: {
    code: 3004,
    message: "Appointment not found",
    statusCode: 404,
  },
  CLINIC_NOT_FOUND: {
    code: 3005,
    message: "Clinic not found",
    statusCode: 404,
  },
  RESOURCE_ALREADY_EXISTS: {
    code: 3006,
    message: "Resource already exists",
    statusCode: 409,
  },
  DUPLICATE_EMAIL: {
    code: 3007,
    message: "Email address is already registered",
    statusCode: 409,
  },
  DUPLICATE_PHONE: {
    code: 3008,
    message: "Phone number is already registered",
    statusCode: 409,
  },
};

// Business Logic Errors (4000-4999)
const BUSINESS_ERRORS = {
  APPOINTMENT_FULL: {
    code: 4001,
    message: "Appointment has reached maximum capacity",
    statusCode: 400,
  },
  APPOINTMENT_EXPIRED: {
    code: 4002,
    message: "Cannot register for past appointments",
    statusCode: 400,
  },
  ALREADY_REGISTERED: {
    code: 4003,
    message: "Patient is already registered for this appointment",
    statusCode: 400,
  },
  DOCTOR_UNAVAILABLE: {
    code: 4004,
    message: "Doctor is not available at the requested time",
    statusCode: 400,
  },
  APPOINTMENT_CONFLICT: {
    code: 4005,
    message: "Doctor already has an appointment at this time",
    statusCode: 409,
  },
  INVALID_APPOINTMENT_TIME: {
    code: 4006,
    message: "Appointment time is outside of working hours",
    statusCode: 400,
  },
  CANCELLATION_DEADLINE_PASSED: {
    code: 4007,
    message: "Cancellation deadline has passed",
    statusCode: 400,
  },
  PRESCRIPTION_LIMIT_EXCEEDED: {
    code: 4008,
    message: "Prescription limit exceeded for this medication",
    statusCode: 400,
  },
};

// System Errors (5000-5999)
const SYSTEM_ERRORS = {
  DATABASE_CONNECTION_FAILED: {
    code: 5001,
    message: "Failed to connect to database",
    statusCode: 500,
  },
  EMAIL_SERVICE_UNAVAILABLE: {
    code: 5002,
    message: "Email service is currently unavailable",
    statusCode: 503,
  },
  FILE_UPLOAD_FAILED: {
    code: 5003,
    message: "Failed to upload file",
    statusCode: 500,
  },
  EXTERNAL_API_ERROR: {
    code: 5004,
    message: "External service error",
    statusCode: 502,
  },
  RATE_LIMIT_EXCEEDED: {
    code: 5005,
    message: "Too many requests, please try again later",
    statusCode: 429,
  },
  MAINTENANCE_MODE: {
    code: 5006,
    message: "System is currently under maintenance",
    statusCode: 503,
  },
};

// Export all error codes grouped by category
module.exports = {
  AUTH_ERRORS,
  VALIDATION_ERRORS,
  RESOURCE_ERRORS,
  BUSINESS_ERRORS,
  SYSTEM_ERRORS,

  // Helper functions
  getAllCodes() {
    return {
      ...AUTH_ERRORS,
      ...VALIDATION_ERRORS,
      ...RESOURCE_ERRORS,
      ...BUSINESS_ERRORS,
      ...SYSTEM_ERRORS,
    };
  },

  /**
   * Get error by code
   * @param {number} code - Error code
   * @returns {Object|null} Error object or null if not found
   */
  getByCode(code) {
    const allCodes = this.getAllCodes();
    return Object.values(allCodes).find((error) => error.code === code) || null;
  },

  /**
   * Check if error code exists
   * @param {number} code - Error code to check
   * @returns {boolean} True if code exists
   */
  codeExists(code) {
    return this.getByCode(code) !== null;
  },

  /**
   * Get errors by category
   * @param {string} category - Category name (AUTH, VALIDATION, RESOURCE, BUSINESS, SYSTEM)
   * @returns {Object} Errors in the specified category
   */
  getByCategory(category) {
    const categoryMap = {
      AUTH: AUTH_ERRORS,
      VALIDATION: VALIDATION_ERRORS,
      RESOURCE: RESOURCE_ERRORS,
      BUSINESS: BUSINESS_ERRORS,
      SYSTEM: SYSTEM_ERRORS,
    };

    return categoryMap[category.toUpperCase()] || {};
  },

  /**
   * Get error codes by HTTP status code
   * @param {number} statusCode - HTTP status code
   * @returns {Array} Array of error objects with matching status code
   */
  getByStatusCode(statusCode) {
    const allCodes = this.getAllCodes();
    return Object.values(allCodes).filter(
      (error) => error.statusCode === statusCode
    );
  },
};
