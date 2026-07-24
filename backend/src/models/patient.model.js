/* eslint-disable no-plusplus */
const mongoose = require("mongoose");
const { setImageURL } = require("../utils/helpers/helper");

const patientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: false,
    },
    fullName: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      index: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    dateOfBirth: Date,
    bloodType: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"],
      default: "Unknown",
    },
    allergies: {
      type: [String],
      default: [],
    },
    chronicDiseases: {
      type: [String],
      default: [],
    },
    surgicalHistory: {
      type: [String],
      default: [],
    },
    emergencyContact: {
      name: {
        type: String,
        trim: true,
      },
      relation: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
    },
    profileImg: String,
    medicalRecordNumber: {
      type: String,
      unique: true,
      required: [true, "Medical record number is required"],
    },
    addresses: {
      alias: String,
      details: String,
      phone: String,
      city: String,
      postalCode: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    doctorNotes: [
      {
        doctor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "doctor",
          required: true,
        },
        notes: {
          type: String,
          required: true,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Populate user details automatically on find
patientSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name email phone role" });
  next();
});

// Virtual property to delegate to user document
patientSchema.virtual("email").get(function () {
  return this.user ? this.user.email : undefined;
});


patientSchema.post("init", (doc) => {
  setImageURL(doc, "patients", "profileImg");
});

// create
patientSchema.post("save", (doc) => {
  setImageURL(doc, "patients", "profileImg");
});

// Virtual for patient age
patientSchema.virtual("age").get(function () {
  if (this.dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }
  return null;
});

// Index for better search performance
patientSchema.index({ fullName: "text", email: "text" });
patientSchema.index({ email: 1 });
patientSchema.index({ medicalRecordNumber: 1 });
patientSchema.index({ phone: 1 });

const patientModel = mongoose.model("patient", patientSchema);
module.exports = patientModel;
