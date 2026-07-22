const express = require("express");

// Authentication middleware
const { protect, allowedTo } = require("../middlewares/auth.middleware");

// controllers
const {
  getAppointmentById,
  createAppointment, // mapped to createClinicSessionController
  updateAppointment,
  deleteAppointment,
  getAllAppointments, // mapped to getAppointmentsOrScheduleController
  getApprovedAppointments,
  registerAppointment, // mapped to bookAppointmentController
  cancelAppointmentRegistration, // mapped to cancelAppointmentController
  getPendingRegistrations,
  approveRegistration,
  rejectRegistration,
  // specific new names
  bookAppointmentController,
  createClinicSessionController,
  cancelAppointmentController,
  getAppointmentsOrScheduleController,
  cancelSessionController,
  adminBookController,
} = require("../controllers/appointment.controller");

// Validators
const {
  getAppointmentByIdValidator,
  createAppointmentValidator, // mapped to createSessionValidator
  updateAppointmentValidator,
  deleteAppointmentValidator,
  getAppointmentsByDateValidator,
  updateAppointmentStatusValidator,
  registerAppointmentValidator,
  cancelAppointmentRegistrationValidator,
  cancelOwnAppointmentRegistrationValidator,
  approveRegistrationValidator,
  rejectRegistrationValidator,
  // specific new names
  bookAppointmentValidator,
  cancelAppointmentValidator,
} = require("../validators/appointment.validators");

const router = express.Router();

// Public / Authenticated GET routes
router.get(
  "/approved",
  getAppointmentsByDateValidator,
  getApprovedAppointments
);

router.get("/", getAppointmentsByDateValidator, getAllAppointments);

router.get("/:id", getAppointmentByIdValidator, getAppointmentById);

// Public / Patient book route
router.post(
  "/book",
  bookAppointmentValidator,
  bookAppointmentController
);

// Register mapping (compatibility for old /:id/register bookings)
router.post(
  "/:id/register",
  registerAppointmentValidator,
  registerAppointment
);

// Cancel mapping (compatibility for old /:id/cancel cancellations)
router.delete(
  "/:id/cancel",
  cancelAppointmentRegistrationValidator,
  cancelAppointmentRegistration
);

// Protected routes (authentication required)
router.use(protect);

// Routes for patients - they can view their own appointments
router.get("/my/appointments", allowedTo("patient"), getAllAppointments);

// Cancel own appointment registration
router.delete(
  "/:id/cancel-my-registration",
  allowedTo("patient"),
  cancelOwnAppointmentRegistrationValidator,
  cancelAppointmentRegistration
);

// Routes for doctors and admins (creates ClinicSession)
router.post(
  "/",
  allowedTo("doctor", "admin"),
  createAppointmentValidator,
  createAppointment
);

// Routes for specific appointments - require authentication
router
  .route("/:id")
  .patch(
    allowedTo("doctor", "admin"),
    updateAppointmentValidator,
    updateAppointment
  )
  .delete(
    allowedTo("admin", "doctor"),
    deleteAppointmentValidator,
    deleteAppointment
  );

// Update appointment status
router.patch(
  "/:id/status",
  allowedTo("doctor", "admin"),
  updateAppointmentStatusValidator,
  updateAppointment
);

// Cancel clinic session
router.patch(
  "/:id/cancel-session",
  allowedTo("doctor", "admin"),
  getAppointmentByIdValidator,
  cancelSessionController
);

// Admin-only Book and Approve appointment
router.post(
  "/:id/admin-book",
  allowedTo("admin"),
  getAppointmentByIdValidator,
  adminBookController
);

// Admin-only / Doctor approval list endpoints (Mocked out)
router.get(
  "/pending-registrations",
  allowedTo("admin"),
  getPendingRegistrations
);

router.patch(
  "/:id/approve-registration",
  allowedTo("admin", "doctor"),
  approveRegistrationValidator,
  approveRegistration
);

router.patch(
  "/:id/reject-registration",
  allowedTo("admin", "doctor"),
  rejectRegistrationValidator,
  rejectRegistration
);

module.exports = router;
