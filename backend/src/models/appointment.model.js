const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClinicSession",
      required: [true, "Session is required"],
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "patient",
      required: [true, "Patient is required"],
    },
    slotIndex: {
      type: Number,
      required: [true, "Slot index is required"],
    },
    appointmentTime: {
      type: Date,
      required: [true, "Appointment time is required"],
    },
    type: {
      type: String,
      required: true,
      enum: ["consultation", "surgery", "emergency", "follow-up"],
      default: "consultation",
    },
    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent"],
      default: "normal",
    },
    status: {
      type: String,
      enum: ["Pending", "Scheduled", "Completed", "Cancelled", "Missed"],
      default: "Pending",
    },
    notes: {
      type: String,
      default: "",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Set priority based on appointment type
appointmentSchema.pre("save", function (next) {
  if (this.isModified("type")) {
    switch (this.type) {
      case "consultation":
        this.priority = "normal";
        break;
      case "surgery":
        this.priority = "high";
        break;
      case "emergency":
        this.priority = "urgent";
        break;
      case "follow-up":
        this.priority = "low";
        break;
      default:
        this.priority = "normal";
    }
  }
  next();
});

// Populate session (with doctor and clinic) and patient on find
appointmentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "session",
    populate: [
      { path: "doctor", select: "fullName specialization phone" },
      { path: "clinic", select: "name clinicNumber location" },
    ],
  });
  this.populate({
    path: "patient",
    select: "fullName email phone",
  });
  next();
});

// Register dummy schemas for Prescription and MedicalRecord to prevent MissingSchemaError during populate
if (!mongoose.models.Prescription) {
  const prescriptionSchema = new mongoose.Schema({
    medication: String,
    dosage: String,
    instructions: String,
  });
  mongoose.model("Prescription", prescriptionSchema);
}

if (!mongoose.models.MedicalRecord) {
  const medicalRecordSchema = new mongoose.Schema({
    diagnosis: String,
    date: Date,
    notes: String,
  });
  mongoose.model("MedicalRecord", medicalRecordSchema);
}

const appointmentModel = mongoose.model("appointment", appointmentSchema);
module.exports = appointmentModel;
