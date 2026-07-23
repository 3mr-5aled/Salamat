const ApiError = require("../utils/errors/apiError.utils");
const Appointment = require("../models/appointment.model");
const ClinicSession = require("../models/clinicSession.model");
const Doctor = require("../models/doctor.model");
const Patient = require("../models/patient.model");
const { generateSessionSlots } = require("../utils/helpers/sessionHelper");

/**
 * Appointment Service
 * Handles all business logic related to session-based appointment scheduling
 */
class AppointmentService {
  /**
   * Get all appointments with filtering
   * @param {Object} filter - Filter criteria
   * @returns {Array} List of appointments
   */
  async getAllAppointments(filter = {}) {
    try {
      // Map patientId filter to patient if passed as string/object
      const parsedFilter = { ...filter };
      if (parsedFilter["patient.patientId"]) {
        parsedFilter.patient = parsedFilter["patient.patientId"];
        delete parsedFilter["patient.patientId"];
      }

      const appointments = await Appointment.find(parsedFilter)
        .sort({ appointmentTime: 1 });

      return appointments;
    } catch (error) {
      throw new ApiError("Failed to fetch appointments", 500);
    }
  }

  /**
   * Get approved/active appointments
   * @param {Object} filter - Filter criteria
   * @returns {Array} Appointments
   */
  async getApprovedAppointments(filter = {}) {
    try {
      const appointments = await Appointment.find(filter)
        .sort({ appointmentTime: 1 });
      return appointments;
    } catch (error) {
      throw new ApiError("Failed to fetch approved appointments", 500);
    }
  }

  /**
   * Create a clinic session (formerly creating a slot)
   * @param {Object} sessionData - Session data
   * @returns {Object} Created session
   */
  async createClinicSession(sessionData) {
    try {
      const { doctor, clinic, date, startTime, endTime, appointmentDuration } = sessionData;

      // Validate doctor exists and is active
      const doctorDoc = await Doctor.findById(doctor);
      if (!doctorDoc) {
        throw new ApiError("Doctor not found", 404);
      }
      if (!doctorDoc.isActive) {
        throw new ApiError("Doctor is not active", 400);
      }

      const timeToMinutes = (timeStr) => {
        if (!timeStr) return 0;
        const [hours, minutes] = timeStr.split(":").map(Number);
        return hours * 60 + minutes;
      };

      const startMinutes = timeToMinutes(startTime);
      const endMinutes = timeToMinutes(endTime);

      if (endMinutes <= startMinutes) {
        throw new ApiError("End time must be after start time", 400);
      }

      const duration = appointmentDuration || 30;
      const capacity = Math.floor((endMinutes - startMinutes) / duration);
      if (capacity === 0) {
        throw new ApiError(
          `Appointment duration (${duration} min) exceeds available window (${endMinutes - startMinutes} min). Extend the time window or reduce duration.`,
          400
        );
      }

      // Check for overlapping sessions
      const overlappingSession = await ClinicSession.findOne({
        doctor,
        date: new Date(date),
        startTime,
      });

      if (overlappingSession) {
        throw new ApiError(
          "Conflict: Doctor already has a session starting at this time on this date.",
          409
        );
      }

      const session = await ClinicSession.create({
        doctor,
        clinic,
        date: new Date(date),
        startTime,
        endTime,
        appointmentDuration: appointmentDuration || 30,
        status: "Open"
      });

      return session;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError("Failed to create clinic session", 500);
    }
  }

  /**
   * Book an appointment in a session (assigning the earliest available slot)
   * @param {string} sessionId - Clinic Session ID
   * @param {string} patientId - Patient ID
   * @param {string} notes - Symptoms or booking notes
   * @returns {Object} Created appointment
   */
  async bookSessionAppointment(sessionId, patientId, notes = "") {
    try {
      // 1. Load the ClinicSession
      const session = await ClinicSession.findById(sessionId);
      if (!session) {
        throw new ApiError("Clinic session not found", 404);
      }
      if (session.status !== "Open") {
        throw new ApiError("This clinic session is not open for booking", 400);
      }

      const sessionDate = new Date(session.date);
      sessionDate.setHours(23, 59, 59, 999);
      if (sessionDate < new Date()) {
        throw new ApiError("Cannot register for a past clinic session", 400);
      }

      // 2. Validate patient exists
      const patient = await Patient.findById(patientId);
      if (!patient) {
        throw new ApiError("Patient not found", 404);
      }

      // 3. Generate all possible slots
      const allSlots = generateSessionSlots(session);

      // 4. Load all active appointments in that session (exclude Cancelled)
      const bookedAppointments = await Appointment.find({
        session: sessionId,
        status: { $ne: "Cancelled" },
      });

      // 5. Determine occupied slot indexes
      const occupiedIndexes = new Set(bookedAppointments.map((app) => app.slotIndex));

      // 6. Find the first available slot index
      const availableSlot = allSlots.find((slot) => !occupiedIndexes.has(slot.slotIndex));

      if (!availableSlot) {
        throw new ApiError("Session Full", 400);
      }

      // Check if patient is already booked for an active slot in this same session
      const alreadyBooked = bookedAppointments.some(
        (app) => app.patient.toString() === patientId.toString()
      );
      if (alreadyBooked) {
        throw new ApiError("Patient is already booked for this session", 400);
      }

      // 7. Create the Appointment
      const appointment = await Appointment.create({
        session: sessionId,
        patient: patientId,
        slotIndex: availableSlot.slotIndex,
        appointmentTime: availableSlot.appointmentTime,
        status: "Scheduled",
        notes: notes,
      });

      return await appointment.populate([
        {
          path: "session",
          populate: [
            { path: "doctor", select: "fullName specialization" },
            { path: "clinic", select: "name" }
          ]
        },
        { path: "patient", select: "fullName email phone" }
      ]);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError("Failed to book appointment", 500);
    }
  }

  /**
   * Update appointment
   * @param {string} appointmentId - Appointment ID
   * @param {Object} updateData - Update data
   * @returns {Object} Updated appointment
   */
  async updateAppointment(appointmentId, updateData) {
    try {
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        throw new ApiError("Appointment not found", 404);
      }

      const updatedAppointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        updateData,
        { new: true, runValidators: true }
      );

      return updatedAppointment;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError("Failed to update appointment", 500);
    }
  }

  /**
   * Delete appointment (actually cancels it to free the slot)
   * @param {string} appointmentId - Appointment ID
   * @returns {boolean} Success status
   */
  async deleteAppointment(appointmentId) {
    try {
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        throw new ApiError("Appointment not found", 404);
      }
      
      // Update status to Cancelled to free the slot
      appointment.status = "Cancelled";
      await appointment.save();
      return true;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError("Failed to cancel appointment", 500);
    }
  }

  /**
   * Get appointments by doctor
   */
  async getAppointmentsByDoctor(doctorId, options = {}) {
    try {
      const { startDate, endDate } = options;

      const sessionQuery = { doctor: doctorId };
      if (startDate && endDate) {
        sessionQuery.date = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      const sessions = await ClinicSession.find(sessionQuery);
      const sessionIds = sessions.map((s) => s._id);

      const appointments = await Appointment.find({
        session: { $in: sessionIds },
      }).sort({ appointmentTime: 1 });

      return appointments;
    } catch (error) {
      throw new ApiError("Failed to fetch doctor appointments", 500);
    }
  }

  /**
   * Get appointments by patient
   */
  async getAppointmentsByPatient(patientId) {
    try {
      const appointments = await Appointment.find({ patient: patientId })
        .sort({ appointmentTime: 1 });

      return appointments;
    } catch (error) {
      throw new ApiError("Failed to fetch patient appointments", 500);
    }
  }

  /**
   * Cancel all appointments inside a ClinicSession and set its status to Cancelled
   * @param {string} sessionId - Clinic Session ID
   * @param {string} requestedByUserId - User ID requesting cancel
   * @returns {Object} Updated session
   */
  async cancelSession(sessionId, requestedByUserId) {
    try {
      const session = await ClinicSession.findById(sessionId);
      if (!session) {
        throw new ApiError("Session not found", 404);
      }
      if (session.status === "Cancelled") {
        throw new ApiError("Session is already cancelled", 400);
      }

      // Update all non-completed appointments in this session to Cancelled
      await Appointment.updateMany(
        { session: sessionId, status: { $ne: "Completed" } },
        { status: "Cancelled" }
      );

      session.status = "Cancelled";
      await session.save();

      return session;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError("Failed to cancel clinic session", 500);
    }
  }

  /**
   * Cancel sessions for a doctor on a given date.
   * - If date === today: cancels only sessions whose startTime > now (remaining)
   * - If date is in the future: cancels ALL sessions on that date
   *
   * @param {string} doctorId
   * @param {string} date - ISO date string e.g. "2026-07-24"
   * @param {string} requestedByUserId
   * @returns {{ cancelledSessions: number, cancelledAppointments: number }}
   */
  async cancelSessionsOnDate(doctorId, date, requestedByUserId) {
    try {
      const now = new Date();
      const target = new Date(date);

      const dayStart = new Date(target);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(target);
      dayEnd.setHours(23, 59, 59, 999);

      const isToday =
        target.toISOString().split("T")[0] === now.toISOString().split("T")[0];

      const currentTimeStr = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;

      // Fetch all non-cancelled sessions for that doctor on that date
      const sessions = await ClinicSession.find({
        doctor: doctorId,
        date: { $gte: dayStart, $lte: dayEnd },
        status: { $ne: "Cancelled" },
      });

      // If today -> only future sessions; if future date -> all sessions
      const targets = isToday
        ? sessions.filter((s) => s.startTime > currentTimeStr)
        : sessions;

      if (targets.length === 0) {
        throw new ApiError(
          isToday
            ? "No remaining sessions to cancel for today."
            : "No sessions found to cancel on that date.",
          404
        );
      }

      const sessionIds = targets.map((s) => s._id);

      const apptResult = await Appointment.updateMany(
        { session: { $in: sessionIds }, status: { $ne: "Completed" } },
        { status: "Cancelled" }
      );

      await ClinicSession.updateMany(
        { _id: { $in: sessionIds } },
        { status: "Cancelled" }
      );

      return {
        cancelledSessions: targets.length,
        cancelledAppointments: apptResult.modifiedCount,
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError("Failed to cancel sessions", 500);
    }
  }
}

module.exports = new AppointmentService();
