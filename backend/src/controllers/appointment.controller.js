const Appointment = require("../models/appointment.model");
const ClinicSession = require("../models/clinicSession.model");
const appointmentService = require("../services/appointment.service");
const factory = require("./handlers.factory");
const { ApiError } = require("../utils");
const { generateSessionSlots } = require("../utils/helpers/sessionHelper");
const Patient = require("../models/patient.model");

// @desc    Create a clinic session (formerly creating a slot)
// @route   POST /api/appointments
// @access  Private (Doctor / Admin)
exports.createClinicSessionController = async (req, res, next) => {
  try {
    const { doctor, clinic, date, startTime, endTime, appointmentDuration } = req.body;
    // Map input fields if doctorId/clinicId were passed instead
    const doctorId = doctor || req.body.doctorId;
    const clinicId = clinic || req.body.clinicId;

    const session = await appointmentService.createClinicSession({
      doctor: doctorId,
      clinic: clinicId,
      date,
      startTime,
      endTime,
      appointmentDuration,
    });

    res.status(201).json({
      status: "success",
      data: session,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Book an appointment in a session (assigning the earliest available slot)
// @route   POST /api/appointments/book
// @access  Public / Authenticated
exports.bookAppointmentController = async (req, res, next) => {
  try {
    const { sessionId, patientId, symptoms, notes } = req.body;
    const resolvedNotes = symptoms || notes || "";

    const appointment = await appointmentService.bookSessionAppointment(
      sessionId,
      patientId,
      resolvedNotes
    );

    res.status(201).json({
      status: "success",
      data: appointment,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Cancel an appointment (Updates status to Cancelled)
// @route   PATCH /api/appointments/:id/cancel
// @access  Private
exports.cancelAppointmentController = async (req, res, next) => {
  try {
    await appointmentService.deleteAppointment(req.params.id);

    res.status(200).json({
      status: "success",
      message: "Successfully cancelled appointment",
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Get appointments or session schedules based on filters
// @route   GET /api/appointments
// @access  Public / Authenticated
exports.getAppointmentsOrScheduleController = async (req, res, next) => {
  try {
    const formatAppointment = (app) => {
      const session = app.session;
      if (!session) return app;

      const minutesToTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
      };

      const [startH, startM] = session.startTime.split(":").map(Number);
      const startMin = startH * 60 + startM;
      const slotMin = startMin + app.slotIndex * session.appointmentDuration;
      const timeStr = minutesToTime(slotMin);

      let regStatus = "approved";
      if (app.status === "Cancelled") regStatus = "rejected";

      const patientArray = [
        {
          patientId: app.patient ? {
            _id: app.patient._id,
            fullName: app.patient.fullName,
            email: app.patient.email,
            phone: app.patient.phone,
          } : null,
          registrationStatus: regStatus,
          registeredAt: app.createdAt,
          approvedAt: app.createdAt,
          symptoms: app.notes || "",
        }
      ];

      return {
        _id: app._id,
        doctor: session.doctor,
        clinic: session.clinic,
        date: session.date,
        time: timeStr,
        duration: session.appointmentDuration,
        status: app.status === "Cancelled" ? "Cancelled" : "Scheduled",
        notes: app.notes,
        patient: patientArray,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
      };
    };

    let patientProfileId = null;
    if (req.user && req.user.role === "patient") {
      const patientDoc = await Patient.findOne({ user: req.user._id });
      patientProfileId = patientDoc ? patientDoc._id : null;
    }

    let isPatientQuery = false;
    let resolvedPatientId = null;

    if (req.query.patient || req.query["patient.patientId"]) {
      isPatientQuery = true;
      resolvedPatientId = req.query.patient || req.query["patient.patientId"];
    } else if (patientProfileId) {
      isPatientQuery = true;
      resolvedPatientId = patientProfileId;
    }

    // Case 1: Fetching specific patient bookings (e.g. GET /api/appointments?patient=id)
    if (isPatientQuery) {
      if (!req.user) {
        return next(new ApiError("Authentication required to view patient appointments", 401));
      }
      if (req.user.role === "patient") {
        if (!patientProfileId || String(resolvedPatientId) !== String(patientProfileId)) {
          return next(new ApiError("You don't have permission to access these appointments (BOLA)", 403));
        }
      }

      const appointments = await Appointment.find({ patient: resolvedPatientId })
        .sort({ appointmentTime: 1 });

      const formatted = appointments.map(formatAppointment);

      return res.status(200).json({
        status: "success",
        results: formatted.length,
        data: formatted,
      });
    }

    // Case 2: Fetching doctor/clinic schedules (Booked & Available slots merged)
    const { doctor, clinic, session: sessionId, date } = req.query;

    const sessionQuery = {};
    if (doctor) sessionQuery.doctor = doctor;
    if (clinic) sessionQuery.clinic = clinic;
    if (sessionId) sessionQuery._id = sessionId;
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      sessionQuery.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const sessions = await ClinicSession.find(sessionQuery).populate("doctor").populate("clinic");
    let allScheduleSlots = [];

    for (const session of sessions) {
      const slots = generateSessionSlots(session);
      const bookedAppointments = await Appointment.find({
        session: session._id,
        status: { $ne: "Cancelled" },
      }).populate("patient");

      const bookingsMap = new Map(bookedAppointments.map((app) => [app.slotIndex, app]));

      const mergedSlots = slots.map((slot) => {
        const booking = bookingsMap.get(slot.slotIndex);
        if (booking) {
          let shouldRedact = false;
          if (!req.user) {
            shouldRedact = true;
          } else if (req.user.role === "patient") {
            const isOwnBooking = patientProfileId && booking.patient && String(booking.patient._id) === String(patientProfileId);
            if (!isOwnBooking) {
              shouldRedact = true;
            }
          }

          const patientArray = [
            {
              patientId: booking.patient ? {
                _id: booking.patient._id,
                fullName: shouldRedact ? "Booked" : booking.patient.fullName,
                email: shouldRedact ? undefined : booking.patient.email,
                phone: shouldRedact ? undefined : booking.patient.phone,
              } : null,
              registrationStatus: "approved",
              registeredAt: booking.createdAt,
              approvedAt: booking.createdAt,
              symptoms: shouldRedact ? "" : (booking.notes || ""),
            }
          ];

          return {
            _id: booking._id,
            time: slot.time,
            appointmentTime: slot.appointmentTime,
            date: session.date,
            doctor: session.doctor,
            clinic: session.clinic,
            duration: session.appointmentDuration,
            status: "Scheduled",
            IsFull: true,
            NumberOfPatients: 1,
            MaxNumberOfPatients: 1,
            patient: patientArray,
            notes: shouldRedact ? "" : (booking.notes || ""),
            type: "consultation",
            session: session,
          };
        } else {
          return {
            _id: session._id,
            time: slot.time,
            appointmentTime: slot.appointmentTime,
            date: session.date,
            doctor: session.doctor,
            clinic: session.clinic,
            duration: session.appointmentDuration,
            status: "Scheduled",
            IsFull: false,
            NumberOfPatients: 0,
            MaxNumberOfPatients: 1,
            patient: [],
            type: "consultation",
            session: session,
          };
        }
      });

      allScheduleSlots = allScheduleSlots.concat(mergedSlots);
    }

    res.status(200).json({
      status: "success",
      results: allScheduleSlots.length,
      data: allScheduleSlots,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Get appointments with approved patients only (Public view)
// @route   GET /api/appointments/approved
// @access  Public
exports.getApprovedAppointments = exports.getAppointmentsOrScheduleController;

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Public
exports.getAppointmentById = factory.getOne(Appointment);

// @desc    Update an Appointment
// @route   PUT /api/appointments/:id
// @access  Private
exports.updateAppointment = factory.updateOne(Appointment);

// @desc    Delete an appointment
// @route   DELETE /api/appointments/:id
// @access  Private
exports.deleteAppointment = async (req, res, next) => {
  try {
    // Delete appointment directly from DB
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return next(new ApiError(`No appointment found with id ${req.params.id}`, 404));
    }
    res.status(200).json({
      status: "success",
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

// Backward Compatibility Aliases for routing & existing services
exports.createAppointment = exports.createClinicSessionController;
exports.registerAppointment = async (req, res, next) => {
  try {
    const sessionId = req.params.id;
    const { patientId, symptoms, notes } = req.body;
    const resolvedNotes = symptoms || notes || "";

    const appointment = await appointmentService.bookSessionAppointment(
      sessionId,
      patientId,
      resolvedNotes
    );

    res.status(200).json({
      status: "success",
      data: appointment,
    });
  } catch (error) {
    return next(error);
  }
};
exports.cancelAppointmentRegistration = exports.cancelAppointmentController;
exports.getAllAppointments = exports.getAppointmentsOrScheduleController;

// Mock endpoints for approval system (which is no longer needed but kept to prevent route compile crashes)
exports.getPendingRegistrations = async (req, res, next) => {
  res.status(200).json({ status: "success", results: 0, data: [] });
};
exports.approveRegistration = async (req, res, next) => {
  res.status(200).json({ status: "success", message: "Auto-approved" });
};
exports.rejectRegistration = async (req, res, next) => {
  res.status(200).json({ status: "success", message: "Auto-approved" });
};

// @desc    Cancel a clinic session (cancels session status and all associated non-completed slots)
// @route   PATCH /api/appointments/:id/cancel-session
// @access  Private (Doctor / Admin)
exports.cancelSessionController = async (req, res, next) => {
  try {
    const session = await appointmentService.cancelSession(req.params.id, req.user._id);
    res.status(200).json({
      status: "success",
      data: session,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Admin Book & Approve Slot in a single call
// @route   POST /api/appointments/:id/admin-book
// @access  Private (Admin)
exports.adminBookController = async (req, res, next) => {
  try {
    const sessionId = req.params.id;
    const { patientId, symptoms, notes } = req.body;
    const resolvedNotes = symptoms || notes || "";

    const appointment = await appointmentService.bookSessionAppointment(
      sessionId,
      patientId,
      resolvedNotes
    );

    res.status(200).json({
      status: "success",
      data: appointment,
    });
  } catch (error) {
    return next(error);
  }
};
