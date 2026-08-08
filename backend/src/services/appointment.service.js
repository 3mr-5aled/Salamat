const ApiError = require("../utils/errors/apiError.utils");
const Appointment = require("../models/appointment.model");
const ClinicSession = require("../models/clinicSession.model");
const Doctor = require("../models/doctor.model");
const Patient = require("../models/patient.model");
const User = require("../models/user.model");
const { createNotification } = require("../controllers/notification.controller");
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
      const { doctor, clinic, date, startTime, endTime, appointmentDuration, repeatWeeklyUntil } = sessionData;

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

      let currentDate = new Date(date);
      const untilDate = repeatWeeklyUntil ? new Date(repeatWeeklyUntil) : currentDate;

      const createdSessions = [];
      const skippedDates = [];

      while (currentDate <= untilDate) {
        const dayStart = new Date(currentDate);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(currentDate);
        dayEnd.setHours(23, 59, 59, 999);

        // Check for overlapping sessions
        const overlappingSession = await ClinicSession.findOne({
          doctor,
          date: { $gte: dayStart, $lte: dayEnd },
          startTime,
          status: { $ne: "Cancelled" },
        });

        if (overlappingSession) {
          if (!repeatWeeklyUntil) {
            throw new ApiError(
              "Conflict: Doctor already has a session starting at this time on this date.",
              409
            );
          } else {
            skippedDates.push(new Date(currentDate).toISOString().split("T")[0]);
          }
        } else {
          const session = await ClinicSession.create({
            doctor,
            clinic,
            date: new Date(currentDate),
            startTime,
            endTime,
            appointmentDuration: duration,
            status: "Open"
          });
          createdSessions.push(session);
        }

        // Advance by 7 days
        currentDate.setDate(currentDate.getDate() + 7);
      }

      if (createdSessions.length === 0 && skippedDates.length > 0) {
        throw new ApiError(
          `Conflict: All scheduled slots on these dates overlap with existing sessions: ${skippedDates.join(", ")}`,
          409
        );
      }

      const firstSession = createdSessions[0] || null;
      if (repeatWeeklyUntil && firstSession) {
        firstSession._doc = {
          ...firstSession.toObject(),
          createdSessionsCount: createdSessions.length,
          skippedDates,
        };
      }

      return firstSession;
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

      // 3. Single Active Appointment Guardrail across entire system
      const existingActiveAppointment = await Appointment.findOne({
        patient: patientId,
        status: { $in: ["Pending", "Scheduled"] },
      });
      if (existingActiveAppointment) {
        throw new ApiError("Patient already has an active or pending appointment", 400);
      }

      // 4. Generate all possible slots
      const allSlots = generateSessionSlots(session);

      // 5. Load all active appointments in that session (exclude Cancelled)
      const bookedAppointments = await Appointment.find({
        session: sessionId,
        status: { $ne: "Cancelled" },
      });

      // 6. Determine occupied slot indexes
      const occupiedIndexes = new Set(bookedAppointments.map((app) => app.slotIndex));

      // 7. Find the first available slot index that is not reserved for emergency
      const availableSlot = allSlots.find((slot) => !occupiedIndexes.has(slot.slotIndex) && slot.type !== "emergency");

      if (!availableSlot) {
        throw new ApiError("Session Full", 400);
      }

      // 8. Create the Appointment with Pending status
      const appointment = await Appointment.create({
        session: sessionId,
        patient: patientId,
        slotIndex: availableSlot.slotIndex,
        appointmentTime: availableSlot.appointmentTime,
        status: "Pending",
        notes: notes,
        type: availableSlot.type || "consultation",
      });

      // 9. Send notification to Admins
      try {
        const admins = await User.find({ role: "admin" });
        for (const admin of admins) {
          await createNotification({
            recipient: admin._id,
            title: "New Appointment Pending Approval",
            message: `${patient.fullName} requested an appointment for session on ${new Date(session.date).toLocaleDateString()}`,
            type: "appointment_booked",
            link: "/admin/approvals",
          });
        }
      } catch (notifErr) {
        console.error("Failed to dispatch admin notification:", notifErr);
      }

      return await appointment.populate([
        {
          path: "session",
          populate: [
            { path: "doctor", select: "fullName specialization user" },
            { path: "clinic", select: "name" }
          ]
        },
        { path: "patient", select: "fullName email phone user" }
      ]);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError("Failed to book appointment", 500);
    }
  }

  /**
   * Get all pending appointment registrations for admin approval
   */
  async getPendingAppointments() {
    try {
      const pendingAppointments = await Appointment.find({ status: "Pending" })
        .populate({
          path: "session",
          populate: [
            { path: "doctor", select: "fullName specialization user" },
            { path: "clinic", select: "name location" }
          ]
        })
        .populate({ path: "patient", select: "fullName email phone user medicalRecordNumber" })
        .sort({ createdAt: -1 });

      return pendingAppointments;
    } catch (error) {
      throw new ApiError("Failed to fetch pending appointments", 500);
    }
  }

  /**
   * Approve a pending appointment registration
   * @param {string} appointmentId
   */
  async approveAppointment(appointmentId) {
    try {
      const appointment = await Appointment.findById(appointmentId)
        .populate({
          path: "session",
          populate: [{ path: "doctor", select: "fullName user" }]
        })
        .populate({ path: "patient", select: "fullName user" });

      if (!appointment) {
        throw new ApiError("Appointment not found", 404);
      }
      if (appointment.status !== "Pending") {
        throw new ApiError("Appointment is not pending approval", 400);
      }

      appointment.status = "Scheduled";
      await appointment.save();

      // Notify Patient
      if (appointment.patient && appointment.patient.user) {
        const patientUserId = appointment.patient.user._id || appointment.patient.user;
        const doctorName = appointment.session?.doctor?.fullName || "Doctor";
        await createNotification({
          recipient: patientUserId,
          title: "Appointment Approved!",
          message: `Your appointment request with ${doctorName} has been approved.`,
          type: "appointment_approved",
          link: "/patient/my-bookings",
        });
      }

      // Notify Doctor
      if (appointment.session?.doctor?.user) {
        const doctorUserId = appointment.session.doctor.user._id || appointment.session.doctor.user;
        const patientName = appointment.patient?.fullName || "Patient";
        await createNotification({
          recipient: doctorUserId,
          title: "New Appointment Confirmed",
          message: `Appointment for ${patientName} is confirmed for ${new Date(appointment.appointmentTime).toLocaleString()}.`,
          type: "appointment_approved",
          link: "/doctor/schedule",
        });
      }

      return appointment;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError("Failed to approve appointment", 500);
    }
  }

  /**
   * Reject a pending appointment registration
   * @param {string} appointmentId
   * @param {string} reason
   */
  async rejectAppointment(appointmentId, reason = "") {
    try {
      const appointment = await Appointment.findById(appointmentId)
        .populate({
          path: "session",
          populate: [{ path: "doctor", select: "fullName" }]
        })
        .populate({ path: "patient", select: "fullName user" });

      if (!appointment) {
        throw new ApiError("Appointment not found", 404);
      }

      appointment.status = "Cancelled";
      if (reason) {
        appointment.notes = appointment.notes ? `${appointment.notes} | Rejected: ${reason}` : `Rejected: ${reason}`;
      }
      await appointment.save();

      // Notify Patient
      if (appointment.patient && appointment.patient.user) {
        const patientUserId = appointment.patient.user._id || appointment.patient.user;
        await createNotification({
          recipient: patientUserId,
          title: "Appointment Request Update",
          message: `Your appointment request was not approved.${reason ? ` Reason: ${reason}` : ""}`,
          type: "appointment_rejected",
          link: "/patient/my-bookings",
        });
      }

      return appointment;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError("Failed to reject appointment", 500);
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
  async cancelSessionsOnDate(doctorId, date, requestedByUserId, reason, range = "rest") {
    try {
      const now = new Date();

      // Timezone-safe local date calculation
      const getLocalDateString = (d) => {
        const offset = d.getTimezoneOffset();
        const localDate = new Date(d.getTime() - offset * 60 * 1000);
        return localDate.toISOString().split("T")[0];
      };

      const targetDateStr = date;
      const todayDateStr = getLocalDateString(now);
      const isToday = targetDateStr === todayDateStr;

      const target = new Date(date);
      const dayStart = new Date(target);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(target);
      dayEnd.setHours(23, 59, 59, 999);

      const currentTimeStr = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;

      // Fetch all non-cancelled sessions for that doctor on that date
      const sessions = await ClinicSession.find({
        doctor: doctorId,
        date: { $gte: dayStart, $lte: dayEnd },
        status: { $ne: "Cancelled" },
      });

      // If today and range is "rest" -> cancel active/future sessions based on endTime; otherwise cancel all sessions on the date
      const targets = (range === "rest" && isToday)
        ? sessions.filter((s) => s.endTime > currentTimeStr)
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

      const cancelNotes = reason ? `Cancelled by Doctor. Reason: ${reason}` : "Cancelled by Doctor.";
      const apptResult = await Appointment.updateMany(
        { session: { $in: sessionIds }, status: { $ne: "Completed" } },
        { status: "Cancelled", notes: cancelNotes }
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
