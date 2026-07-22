const express = require("express");

// Authentication middleware
const { protect, allowedTo } = require("../controllers/auth.controller");

// controllers
const {
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getAllDoctors,
  uploadDoctorImage,
  resizeImage,
} = require("../controllers/doctor.controller");

// Validators
const {
  getDoctorByIdValidator,
  createDoctorValidator,
  updateDoctorValidator,
  deleteDoctorValidator,
} = require("../validators/doctor.validators");

const router = express.Router();

// Public routes (no authentication required)
router.get("/", getAllDoctors);
router.get("/:id", getDoctorByIdValidator, getDoctorById);

// Protected routes (authentication required)
router.use(protect);

// Routes accessible by admin only
router.post(
  "/",
  allowedTo("admin"),
  uploadDoctorImage,
  resizeImage,
  createDoctorValidator,
  createDoctor
);

router
  .route("/:id")
  .patch(
    allowedTo("admin", "doctor"),
    uploadDoctorImage,
    resizeImage,
    updateDoctorValidator,
    updateDoctor
  )
  .delete(allowedTo("admin"), deleteDoctorValidator, deleteDoctor);

module.exports = router;
