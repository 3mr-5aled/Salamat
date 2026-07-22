const express = require("express");

// Authentication middleware
const { protect, allowedTo } = require("../controllers/auth.controller");

// controllers
const {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  uploadPatientImage,
  resizeImage,
  getPatientUpcomingAppointments,
  addOrUpdateDoctorNotes,
} = require("../controllers/patient.controller");

// Validators
const {
  getPatientByIdValidator,
  createPatientValidator,
  updatePatientValidator,
  deletePatientValidator,
} = require("../validators/patient.validators");

const router = express.Router();

// Public routes (no authentication required)
router.get("/", getAllPatients);
router.get("/:id", getPatientByIdValidator, getPatientById);

// Protected routes (authentication required)
router.use(protect);

// Routes accessible by admin only
router.post(
  "/",
  allowedTo("admin", "patient"),
  uploadPatientImage,
  resizeImage,
  createPatientValidator,
  createPatient
);

router
  .route("/:id")
  .patch(
    allowedTo("admin", "doctor", "patient"),
    uploadPatientImage,
    resizeImage,
    updatePatientValidator,
    updatePatient
  )
  .delete(allowedTo("admin"), deletePatientValidator, deletePatient);

// Get patient upcoming appointments
router
  .route("/appointments/upcoming")
  .get(allowedTo("patient"), getPatientUpcomingAppointments);

router
  .route("/:id/notes")
  .patch(allowedTo("doctor"), addOrUpdateDoctorNotes);

module.exports = router;
