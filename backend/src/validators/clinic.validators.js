// Clinic validation rules
const { body, param } = require("express-validator");
const mongoose = require("mongoose");
const validatorMiddleware = require("../middlewares/validator.middleware");
const Clinic = require("../models/clinic.model");
const Doctor = require("../models/doctor.model");

// Get clinic by ID validator
const getClinicByIdValidator = [
  param("id").isMongoId().withMessage("Invalid clinic ID format"),
  validatorMiddleware,
];

// Create clinic validator
const createClinicValidator = [
  body("name")
    .notEmpty()
    .withMessage("Clinic name is required")
    .isLength({ min: 3 })
    .withMessage("Clinic name must be at least 3 characters")
    .custom(async (value) => {
      const clinic = await Clinic.findOne({ name: value });
      if (clinic) {
        throw new Error("Clinic with this name already exists");
      }
    }),
  body("clinicNumber")
    .notEmpty()
    .withMessage("Clinic number is required")
    .custom(async (value) => {
      const clinic = await Clinic.findOne({ clinicNumber: value });
      if (clinic) {
        throw new Error("Clinic with this number already exists");
      }
    }),
  body("specialty")
    .notEmpty()
    .withMessage("Clinic specialty is required")
    .isIn([
      "Cardiology",
      "Pediatrics",
      "Orthopedics",
      "Oncology",
      "Neurology",
      "Obstetrics and Gynecology",
      "Dermatology",
      "Ophthalmology",
      "ENT (Otolaryngology)",
      "Dental",
      "Internal Medicine",
    ])
    .withMessage("Invalid clinic specialty"),
  body("description").optional().isString(),
  body("floor").optional().isString(),
  body("roomNumber").optional().isString(),
  body("doctors")
    .optional()
    .isArray()
    .withMessage("Doctors must be an array")
    .custom(async (value) => {
      // Validate each doctor ID is a valid MongoId
      const invalidIds = value.filter(
        (doctorId) => !mongoose.Types.ObjectId.isValid(doctorId)
      );
      if (invalidIds.length > 0) {
        throw new Error(`Invalid doctor ID format: ${invalidIds.join(", ")}`);
      }
      // Check if all doctors exist
      const doctors = await Doctor.find({ _id: { $in: value } });
      if (doctors.length !== value.length) {
        throw new Error("One or more doctors do not exist");
      }
    }),

  validatorMiddleware,
];

// Update clinic validator
const updateClinicValidator = [
  param("id").isMongoId().withMessage("Invalid clinic ID format"),
  body("name")
    .optional()
    .notEmpty()
    .withMessage("Clinic name is required")
    .isLength({ min: 3 })
    .withMessage("Clinic name must be at least 3 characters")
    .custom(async (value, { req }) => {
      const clinic = await Clinic.findOne({
        name: value,
        _id: { $ne: req.params.id },
      });
      if (clinic) {
        throw new Error("Clinic with this name already exists");
      }
    }),
  body("clinicNumber")
    .optional()
    .notEmpty()
    .withMessage("Clinic number is required")
    .custom(async (value, { req }) => {
      const clinic = await Clinic.findOne({
        clinicNumber: value,
        _id: { $ne: req.params.id },
      });
      if (clinic) {
        throw new Error("Clinic with this number already exists");
      }
    }),
  body("specialty")
    .optional()
    .notEmpty()
    .withMessage("Clinic specialty is required")
    .isIn([
      "Cardiology",
      "Pediatrics",
      "Orthopedics",
      "Oncology",
      "Neurology",
      "Obstetrics and Gynecology",
      "Dermatology",
      "Ophthalmology",
      "ENT (Otolaryngology)",
      "Dental",
      "Internal Medicine",
    ])
    .withMessage("Invalid clinic specialty"),
  body("description").optional().isString(),
  body("floor").optional().isString(),
  body("roomNumber").optional().isString(),
  body("doctors")
    .optional()
    .isArray()
    .withMessage("Doctors must be an array")
    .custom(async (value) => {
      // Validate each doctor ID is a valid MongoId
      const invalidIds = value.filter(
        (doctorId) => !mongoose.Types.ObjectId.isValid(doctorId)
      );
      if (invalidIds.length > 0) {
        throw new Error(`Invalid doctor ID format: ${invalidIds.join(", ")}`);
      }
      // Check if all doctors exist
      const doctors = await Doctor.find({ _id: { $in: value } });
      if (doctors.length !== value.length) {
        throw new Error("One or more doctors do not exist");
      }
    }),
  validatorMiddleware,
];

// Delete clinic validator
const deleteClinicValidator = [
  param("id").isMongoId().withMessage("Invalid clinic ID format"),
  validatorMiddleware,
];

module.exports = {
  getClinicByIdValidator,
  createClinicValidator,
  updateClinicValidator,
  deleteClinicValidator,
};
