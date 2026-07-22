/**
 * Services Index
 * Centralized exports for all services
 */

const authService = require("./auth.service");
const appointmentService = require("./appointment.service");
const patientService = require("./patient.service");
const doctorService = require("./doctor.service");

module.exports = {
  authService,
  appointmentService,
  patientService,
  doctorService,
};
