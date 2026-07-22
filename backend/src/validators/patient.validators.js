// Patient validation rules
const { body, param } = require("express-validator");
const validatorMiddleware = require("../middlewares/validator.middleware");

// Get patient by ID validator
const getPatientByIdValidator = [
  param("id").isMongoId().withMessage("Invalid patient ID format"),
];

// Create patient validator
const createPatientValidator = [
  // Required fields
  body("fullName")
    .notEmpty()
    .withMessage("Patient name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Patient name must be between 2 and 100 characters")
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
      if (birthDate > today) {
        throw new Error("Date of birth cannot be in the future");
      }
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age > 150) {
        throw new Error("Age cannot be more than 150 years");
      }
      return true;
    }),

  body("bloodType")
    .optional()
    .isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .withMessage("Blood type must be A+, A-, B+, B-, AB+, AB-, O+, or O-"),

  body("allergies")
    .optional()
    .isArray()
    .withMessage("Allergies must be an array")
    .custom((allergies) => {
      if (allergies.length > 0) {
        allergies.forEach((allergy) => {
          if (typeof allergy !== "string" || allergy.trim().length < 2) {
            throw new Error("Each allergy must be at least 2 characters");
          }
        });
      }
      return true;
    }),

  body("chronicDiseases")
    .optional()
    .isArray()
    .withMessage("Chronic diseases must be an array")
    .custom((diseases) => {
      if (diseases.length > 0) {
        diseases.forEach((disease) => {
          if (typeof disease !== "string" || disease.trim().length < 2) {
            throw new Error(
              "Each chronic disease must be at least 2 characters"
            );
          }
        });
      }
      return true;
    }),

  body("emergencyContact.name")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Emergency contact name must be between 2 and 100 characters"),

  body("emergencyContact.relation")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage(
      "Emergency contact relation must be between 2 and 50 characters"
    ),

  body("emergencyContact.phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),

  body("profileImage")
    .optional()
    .isURL()
    .withMessage("Profile image must be a valid URL"),

  body("medicalRecordNumber")
    .optional()
    .isLength({ min: 5, max: 20 })
    .withMessage("Medical record number must be between 5 and 20 characters"),

  body("address")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Address must be at most 200 characters"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),
  validatorMiddleware,
];

// Update patient validator
const updatePatientValidator = [
  param("id").isMongoId().withMessage("Invalid patient ID format"),

  // All fields are optional for updates
  body("fullName")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Patient name must be between 2 and 100 characters")
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
      if (birthDate > today) {
        throw new Error("Date of birth cannot be in the future");
      }
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age > 150) {
        throw new Error("Age cannot be more than 150 years");
      }
      return true;
    }),

  body("bloodType")
    .optional()
    .isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .withMessage("Blood type must be A+, A-, B+, B-, AB+, AB-, O+, or O-"),

  body("allergies")
    .optional()
    .isArray()
    .withMessage("Allergies must be an array"),

  body("chronicDiseases")
    .optional()
    .isArray()
    .withMessage("Chronic diseases must be an array"),

  body("emergencyContact.name")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Emergency contact name must be between 2 and 100 characters"),

  body("emergencyContact.relation")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage(
      "Emergency contact relation must be between 2 and 50 characters"
    ),

  body("emergencyContact.phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),

  body("profileImage")
    .optional()
    .isURL()
    .withMessage("Profile image must be a valid URL"),

  body("address")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Address must be at most 200 characters"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),
];

// Update medical info validator
const updateMedicalInfoValidator = [
  param("id").isMongoId().withMessage("Invalid patient ID format"),

  body("bloodType")
    .optional()
    .isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .withMessage("Blood type must be A+, A-, B+, B-, AB+, AB-, O+, or O-"),

  body("allergies")
    .optional()
    .isArray()
    .withMessage("Allergies must be an array"),

  body("chronicDiseases")
    .optional()
    .isArray()
    .withMessage("Chronic diseases must be an array"),

  body("emergencyContact.name")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Emergency contact name must be between 2 and 100 characters"),

  body("emergencyContact.relation")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage(
      "Emergency contact relation must be between 2 and 50 characters"
    ),

  body("emergencyContact.phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),
];

// Delete patient validator
const deletePatientValidator = [
  param("id").isMongoId().withMessage("Invalid patient ID format"),
];

module.exports = {
  getPatientByIdValidator,
  createPatientValidator,
  updatePatientValidator,
  updateMedicalInfoValidator,
  deletePatientValidator,
};
