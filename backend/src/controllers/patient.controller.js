const asyncHandler = require("express-async-handler");
const {
  uploadSingleImage,
  resizeImages,
} = require("../middlewares/uploadImage.middleware");
const Patient = require("../models/patient.model");
const User = require("../models/user.model");
const ApiError = require("../utils/errors/apiError.utils");
const Appointment = require("../models/appointment.model");
const factory = require("./handlers.factory");

// Upload single image
exports.uploadPatientImage = uploadSingleImage("profileImg");

exports.resizeImage = resizeImages({
  fieldName: "profileImg",
  uploadPath: "user",
  mimetype: "jpeg",
  quality: 95,
  imageLength: 600,
  imageWidth: 600,
});

// @desc    Get all patients
// @route   GET /api/patients
// @access  Public
exports.getAllPatients = factory.getAll(Patient, "Patients");

// @desc    Get patient by ID
// @route   GET /api/patients/:id
// @access  Public
exports.getPatientById = factory.getOne(Patient);

const generateMedicalRecordNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `MRN${timestamp.slice(-6)}${random}`;
};

// @desc    Create a patient
// @route   POST /api/patients
// @access  Public
exports.createPatient = asyncHandler(async (req, res, next) => {
  // If user is logged in
  if (req.user) {
    if (req.user.role === "patient") {
      req.body.user = req.user._id;
      req.body.fullName = req.body.fullName || req.user.name;

      let patient = await Patient.findOne({ user: req.user._id });
      if (patient) {
        patient = await Patient.findByIdAndUpdate(patient._id, req.body, {
          new: true,
          runValidators: true,
        });
        return res.status(200).json({
          status: "success",
          message: "Patient profile updated successfully",
          data: patient,
        });
      }
    }
  }

  // Admin creating patient account flow
  if (req.body.phone) {
    req.body.phone = req.body.phone.replace(/^(\+2|002)/, "").replace(/\s/g, "");
  }

  if (req.body.email && req.body.password) {
    const user = await User.create({
      name: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      role: "patient",
      isVerified: true,
    });
    req.body.user = user._id;
  } else {
    // Ensure we don't accidentally write empty strings or dummy values to user field
    delete req.body.user;
  }

  if (!req.body.user && req.user) {
    req.body.user = req.user._id;
  }
  if (req.user && !req.body.fullName) {
    req.body.fullName = req.user.name;
  }
  if (!req.body.medicalRecordNumber) {
    req.body.medicalRecordNumber = generateMedicalRecordNumber();
  }

  const newPatient = await Patient.create(req.body);
  res.status(201).json({
    status: "success",
    data: newPatient,
  });
});

// @desc    Update a patient
// @route   PUT /api/patients/:id
// @access  Public
exports.updatePatient = factory.updateOne(Patient);

// @desc    Delete a patient
// @route   DELETE /api/patients/:id
// @access  Public
exports.deletePatient = factory.deleteOne(Patient);

// @desc    Get patient upcoming appointments
// @route   GET /api/patients/appointments/upcoming
// @access  Private (Patient)
exports.getPatientUpcomingAppointments = async (req, res, next) => {
  try {
    const profile = await Patient.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(200).json({
        status: "success",
        results: 0,
        data: [],
        message: "No upcoming appointments found",
      });
    }
    const patientId = profile._id;

    // Find appointments where this patient is registered
    const appointments = await Appointment.find({
      patient: patientId,
      appointmentTime: { $gte: new Date() },
      status: { $ne: "Cancelled" },
    })
      .populate({
        path: "session",
        populate: [
          { path: "doctor", select: "fullName specialization" },
          { path: "clinic", select: "name location" },
        ],
      })
      .sort({ appointmentTime: 1 });

    if (!appointments || appointments.length === 0) {
      return res.status(200).json({
        status: "success",
        results: 0,
        data: [],
        message: "No upcoming appointments found",
      });
    }

    const patientAppointments = appointments.map((appointment) => {
      const doc = appointment.session ? appointment.session.doctor : null;
      const cl = appointment.session ? appointment.session.clinic : null;
      const dt = appointment.session ? appointment.session.date : null;

      return {
        appointmentId: appointment._id,
        doctor: doc,
        clinic: cl,
        date: dt,
        time: appointment.appointmentTime ? appointment.appointmentTime.toISOString() : "",
        notes: appointment.notes,
        status: appointment.status,
      };
    });

    res.status(200).json({
      status: "success",
      results: patientAppointments.length,
      data: patientAppointments,
    });
  } catch (error) {
    return next(error);
  }
};

const Doctor = require("../models/doctor.model");

// @desc    Add or update doctor notes on patient profile
// @route   PATCH /api/v1/patients/:id/notes
// @access  Private (Doctor only)
exports.addOrUpdateDoctorNotes = asyncHandler(async (req, res, next) => {
  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) {
    return next(new ApiError("Doctor profile not found", 404));
  }

  const patient = await Patient.findById(req.params.id);
  if (!patient) {
    return next(new ApiError("Patient not found", 404));
  }

  const { notes } = req.body;
  if (!patient.doctorNotes) {
    patient.doctorNotes = [];
  }

  const noteIndex = patient.doctorNotes.findIndex(
    (n) => n.doctor.toString() === doctor._id.toString()
  );

  if (noteIndex > -1) {
    patient.doctorNotes[noteIndex].notes = notes;
    patient.doctorNotes[noteIndex].updatedAt = Date.now();
  } else {
    patient.doctorNotes.push({
      doctor: doctor._id,
      notes,
      updatedAt: Date.now(),
    });
  }

  await patient.save();

  // Populate doctor info in returned notes
  const updatedPatient = await Patient.findById(patient._id).populate({
    path: "doctorNotes.doctor",
    select: "fullName specialization",
  });

  res.status(200).json({
    status: "success",
    data: updatedPatient,
  });
});
