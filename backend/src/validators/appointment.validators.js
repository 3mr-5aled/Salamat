const { body, param, query } = require("express-validator");
const validatorMiddleware = require("../middlewares/validator.middleware");

// Basic parameter validator used as fallback
const basicIdValidator = [
  param("id").isMongoId().withMessage("Invalid ID format"),
  validatorMiddleware
];

// Create Session Validator
const createSessionValidator = [
  body("doctorId")
    .notEmpty()
    .withMessage("Doctor ID is required")
    .isMongoId()
    .withMessage("Invalid doctor ID format"),
  body("clinicId")
    .notEmpty()
    .withMessage("Clinic ID is required")
    .isMongoId()
    .withMessage("Invalid clinic ID format"),
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Invalid date format. Use YYYY-MM-DD"),
  body("startTime")
    .notEmpty()
    .withMessage("Start time is required")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Invalid start time format. Use HH:MM"),
  body("endTime")
    .notEmpty()
    .withMessage("End time is required")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Invalid end time format. Use HH:MM"),
  body("appointmentDuration")
    .optional()
    .isInt({ min: 5, max: 120 })
    .withMessage("Appointment duration must be between 5 and 120 minutes"),
  validatorMiddleware,
];

// Book Appointment Validator
const bookAppointmentValidator = [
  body("sessionId")
    .notEmpty()
    .withMessage("Session ID is required")
    .isMongoId()
    .withMessage("Invalid session ID format"),
  body("patientId")
    .notEmpty()
    .withMessage("Patient ID is required")
    .isMongoId()
    .withMessage("Invalid patient ID format"),
  body("symptoms")
    .optional()
    .isString()
    .withMessage("Symptoms must be a string"),
  validatorMiddleware,
];

// Cancel Appointment Validator
const cancelAppointmentValidator = [
  param("id").isMongoId().withMessage("Invalid appointment ID format"),
  validatorMiddleware,
];

// Get appointments query validator
const getAppointmentsByDateValidator = [
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid start date format. Use ISO 8601"),
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid end date format. Use ISO 8601"),
  query("doctor")
    .optional()
    .isMongoId()
    .withMessage("Invalid doctor ID format"),
  query("patient")
    .optional()
    .isMongoId()
    .withMessage("Invalid patient ID format"),
  query("clinic")
    .optional()
    .isMongoId()
    .withMessage("Invalid clinic ID format"),
  query("session")
    .optional()
    .isMongoId()
    .withMessage("Invalid session ID format"),
  query("date")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format"),
  query("status")
    .optional()
    .isIn(["Scheduled", "Completed", "Cancelled", "Missed"])
    .withMessage("Invalid status value"),
  validatorMiddleware,
];

// Update appointment status validator
const updateAppointmentStatusValidator = [
  param("id").isMongoId().withMessage("Invalid appointment ID format"),
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["Scheduled", "Completed", "Cancelled", "Missed"])
    .withMessage("Status must be one of: Scheduled, Completed, Cancelled, Missed"),
  body("notes")
    .optional()
    .isString()
    .withMessage("Notes must be a string"),
  validatorMiddleware,
];

// Compatibility definitions to prevent breaking imports in other files
module.exports = {
  getAppointmentByIdValidator: basicIdValidator,
  createAppointmentValidator: createSessionValidator, // Alias old create to session validator
  updateAppointmentValidator: basicIdValidator,
  deleteAppointmentValidator: basicIdValidator,
  getAppointmentsByDateValidator,
  updateAppointmentStatusValidator,
  registerAppointmentValidator: basicIdValidator,
  cancelAppointmentRegistrationValidator: cancelAppointmentValidator,
  cancelOwnAppointmentRegistrationValidator: cancelAppointmentValidator,
  approveRegistrationValidator: basicIdValidator,
  rejectRegistrationValidator: basicIdValidator,
  // New specific exports
  createSessionValidator,
  bookAppointmentValidator,
  cancelAppointmentValidator,
};
