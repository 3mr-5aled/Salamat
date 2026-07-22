const mongoose = require("mongoose");

const clinicSessionSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
      required: [true, "Doctor is required"],
    },
    clinic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clinic",
      required: [true, "Clinic is required"],
    },
    date: {
      type: Date,
      required: [true, "Session date is required"],
    },
    startTime: {
      type: String, // HH:MM format, e.g., "09:00"
      required: [true, "Start time is required"],
    },
    endTime: {
      type: String, // HH:MM format, e.g., "11:00"
      required: [true, "End time is required"],
    },
    appointmentDuration: {
      type: Number, // In minutes, e.g., 30
      required: [true, "Appointment duration is required"],
      default: 30,
    },
    status: {
      type: String,
      enum: ["Open", "Closed", "Cancelled"],
      default: "Open",
    },
  },
  { timestamps: true }
);

// Compound index to prevent doctor session conflicts on the same date/time range
clinicSessionSchema.index({ doctor: 1, date: 1, startTime: 1 }, { unique: true });

const ClinicSession = mongoose.model("ClinicSession", clinicSessionSchema);
module.exports = ClinicSession;
