const express = require("express");
const asyncHandler = require("express-async-handler");
const Clinic = require("../models/clinic.model");
const Doctor = require("../models/doctor.model");

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const clinicsCount = await Clinic.countDocuments();
    const doctorsCount = await Doctor.countDocuments();
    res.status(200).json({
      status: "success",
      data: {
        clinicsCount,
        doctorsCount,
      },
    });
  })
);

module.exports = router;
