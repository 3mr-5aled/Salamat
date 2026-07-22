const asyncHandler = require("express-async-handler");
const Clinic = require("../models/clinic.model");
const Doctor = require("../models/doctor.model");
const { ApiError } = require("../utils");
const factory = require("./handlers.factory");

// @desc    Get all Clinics
// @route   GET /api/clinics
// @access  Private
exports.getAllClinics = factory.getAll(Clinic, "Clinics");

// @desc    Get clinic by ID
// @route   GET /api/clinics/:id
// @access  Public
exports.getClinicById = factory.getOne(Clinic);

// @desc    Create a clinic
// @route   POST /api/clinics
// @access  Private
exports.createClinic = factory.createOne(Clinic);

// @desc    Update a clinic
// @route   PUT /api/clinics/:id
// @access  Private
exports.updateClinic = factory.updateOne(Clinic);

// @desc    Delete a clinic
// @route   DELETE /api/clinics/:id
// @access  Private
exports.deleteClinic = factory.deleteOne(Clinic);

// @desc    Assign doctor to clinic
// @route   POST /api/v1/clinics/:id/doctors
// @access  Private/Admin
exports.assignDoctorToClinic = asyncHandler(async (req, res, next) => {
  const { doctorId } = req.body;
  
  const clinic = await Clinic.findById(req.params.id);
  if (!clinic) {
    return next(new ApiError("Clinic not found", 404));
  }

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return next(new ApiError("Doctor not found", 404));
  }

  // Validate specialty match
  if (doctor.specialization !== clinic.specialty) {
    return next(new ApiError(`Doctor specialty (${doctor.specialization}) does not match clinic specialty (${clinic.specialty})`, 400));
  }

  // If doctor is already in another clinic, remove them from that clinic's doctors list
  if (doctor.clinic && doctor.clinic.toString() !== clinic._id.toString()) {
    await Clinic.findByIdAndUpdate(doctor.clinic, {
      $pull: { doctors: doctor._id }
    });
  }

  // Update doctor's clinic reference
  doctor.clinic = clinic._id;
  await doctor.save();

  // Add doctor to clinic's doctors array
  await Clinic.findByIdAndUpdate(clinic._id, {
    $addToSet: { doctors: doctor._id }
  });

  const updatedClinic = await Clinic.findById(clinic._id).populate("doctors");
  res.status(200).json({
    status: "success",
    data: { clinic: updatedClinic }
  });
});

// @desc    Remove doctor from clinic
// @route   DELETE /api/v1/clinics/:id/doctors/:doctorId
// @access  Private/Admin
exports.removeDoctorFromClinic = asyncHandler(async (req, res, next) => {
  const clinic = await Clinic.findById(req.params.id);
  if (!clinic) {
    return next(new ApiError("Clinic not found", 404));
  }

  const doctor = await Doctor.findById(req.params.doctorId);
  if (!doctor) {
    return next(new ApiError("Doctor not found", 404));
  }

  // Clear doctor's clinic reference
  doctor.clinic = undefined;
  await doctor.save();

  // Remove doctor from clinic's doctors array
  await Clinic.findByIdAndUpdate(clinic._id, {
    $pull: { doctors: doctor._id }
  });

  const updatedClinic = await Clinic.findById(clinic._id).populate("doctors");
  res.status(200).json({
    status: "success",
    data: { clinic: updatedClinic }
  });
});
