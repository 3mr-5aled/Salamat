// Doctor validation rules
const { body, param } = require("express-validator");
const validatorMiddleware = require("../middlewares/validator.middleware");
const { checkClinicsExists } = require("../utils/helpers/helper");
const Clinic = require("../models/clinic.model"); // Assuming you have a Clinic model

// Get doctor by ID validator
const getDoctorByIdValidator = [
  param("id").isMongoId().withMessage("Invalid doctor ID format"),
  validatorMiddleware,
];

// Create doctor validator
const createDoctorValidator = [
  // Required fields
  body("fullName")
    .notEmpty()
    .withMessage("Doctor name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Doctor name must be between 3 and 100 characters")
    .trim(),

  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail()
    .toLowerCase(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one letter and one number"),

  body("specialization")
    .notEmpty()
    .withMessage("Specialization is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Specialization must be between 2 and 100 characters")
    .trim(),

  // Optional fields
  body("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),

  body("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be male, female, or other"),

  body("dateOfBirth")
    .optional()
    .isISO8601()
    .withMessage("Please provide a valid date of birth (YYYY-MM-DD)")
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18 || age > 100) {
        throw new Error("Doctor must be between 18 and 100 years old");
      }
      return true;
    }),

  body("clinic")
    .optional()
    .isMongoId()
    .withMessage("Clinic must be a valid clinic ID")
    .custom((clinicId) => checkClinicsExists(Clinic, clinicId, "Clinic")),

  body("qualifications")
    .optional()
    .isArray()
    .withMessage("Qualifications must be an array")
    .custom((qualifications) => {
      if (qualifications.length > 0) {
        qualifications.forEach((qual) => {
          if (typeof qual !== "string" || qual.trim().length < 2) {
            throw new Error("Each qualification must be at least 2 characters");
          }
        });
      }
      return true;
    }),

  body("yearsOfExperience")
    .optional()
    .isInt({ min: 0, max: 60 })
    .withMessage("Years of experience must be between 0 and 60"),

  body("profileImage")
    .optional()
    .isURL()
    .withMessage("Profile image must be a valid URL"),

  body("availability")
    .optional()
    .isArray()
    .withMessage("Availability must be an array")
    .custom((availability) => {
      const validDays = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
      const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

      availability.forEach((slot) => {
        if (!validDays.includes(slot.dayOfWeek)) {
          throw new Error(
            `Invalid day: ${slot.dayOfWeek}. Must be one of: ${validDays.join(", ")}`
          );
        }
        if (!timePattern.test(slot.startTime) || !timePattern.test(slot.endTime)) {
          throw new Error("Time must be in HH:MM format (e.g., 09:00)");
        }
        if (slot.startTime >= slot.endTime) {
          throw new Error("'startTime' must be earlier than 'endTime'");
        }
      });
      return true;
    }),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),
  validatorMiddleware,
];

// Update doctor validator
const updateDoctorValidator = [
  param("id").isMongoId().withMessage("Invalid doctor ID format"),

  // All fields are optional for updates
  body("fullName")
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage("Doctor name must be between 3 and 100 characters")
    .trim(),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail()
    .toLowerCase(),

  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one letter and one number"),

  body("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),

  body("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be male, female, or other"),

  body("dateOfBirth")
    .optional()
    .isISO8601()
    .withMessage("Please provide a valid date of birth (YYYY-MM-DD)")
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18 || age > 100) {
        throw new Error("Doctor must be between 18 and 100 years old");
      }
      return true;
    }),

  body("specialization")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Specialization must be between 2 and 100 characters")
    .trim(),

  body("clinic")
    .optional()
    .isMongoId()
    .withMessage("Clinic must be a valid clinic ID")
    .custom((clinicId) => checkClinicsExists(Clinic, clinicId, "Clinic")),

  body("qualifications")
    .optional()
    .isArray()
    .withMessage("Qualifications must be an array")
    .custom((qualifications) => {
      if (qualifications.length > 0) {
        qualifications.forEach((qual) => {
          if (typeof qual !== "string" || qual.trim().length < 2) {
            throw new Error("Each qualification must be at least 2 characters");
          }
        });
      }
      return true;
    }),

  body("yearsOfExperience")
    .optional()
    .isInt({ min: 0, max: 60 })
    .withMessage("Years of experience must be between 0 and 60"),

  body("profileImage")
    .optional()
    .isURL()
    .withMessage("Profile image must be a valid URL"),

  body("availability")
    .optional()
    .isArray()
    .withMessage("Availability must be an array")
    .custom((availability) => {
      const validDays = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
      const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

      availability.forEach((slot) => {
        if (!validDays.includes(slot.dayOfWeek)) {
          throw new Error(
            `Invalid day: ${slot.dayOfWeek}. Must be one of: ${validDays.join(", ")}`
          );
        }
        if (!timePattern.test(slot.startTime) || !timePattern.test(slot.endTime)) {
          throw new Error("Time must be in HH:MM format (e.g., 09:00)");
        }
        if (slot.startTime >= slot.endTime) {
          throw new Error("'startTime' must be earlier than 'endTime'");
        }
      });
      return true;
    }),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),
  validatorMiddleware,
];

// Delete doctor validator
const deleteDoctorValidator = [
  param("id").isMongoId().withMessage("Invalid doctor ID format"),
  validatorMiddleware,
];

module.exports = {
  getDoctorByIdValidator,
  createDoctorValidator,
  updateDoctorValidator,
  deleteDoctorValidator,
};
