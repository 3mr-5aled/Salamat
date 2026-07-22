const authRoute = require("./auth.routes");
const doctorRoute = require("./doctor.routes");
const patientRoute = require("./patient.routes");
const clinicRoute = require("./clinic.routes");
const appointmentRoute = require("./appointment.routes");
const analyticsRoute = require("./analytics.routes");

const mountRoutes = (app) => {
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/doctors", doctorRoute);
  app.use("/api/v1/patients", patientRoute);
  app.use("/api/v1/clinics", clinicRoute);
  app.use("/api/v1/appointments", appointmentRoute);
  app.use("/api/v1/analytics", analyticsRoute);
};

module.exports = mountRoutes;
