const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../../config.env") });

const dbConnection = require("../../config/database.config");
const ClinicSession = require("../../models/clinicSession.model");
const Doctor = require("../../models/doctor.model");

// Temporary local schemas/definitions for old-style appointment migration
const oldAppointmentSchema = new mongoose.Schema(
  {
    type: String,
    duration: Number,
    priority: String,
    status: String,
    patient: [
      {
        patientId: mongoose.Schema.Types.ObjectId,
        registrationStatus: String,
        symptoms: String,
      },
    ],
    doctor: mongoose.Schema.Types.ObjectId,
    clinic: mongoose.Schema.Types.ObjectId,
    date: Date,
    time: String,
    notes: String,
    isPaid: Boolean,
  },
  { strict: false, collection: "appointments" }
);

// We check if "appointment" model is already registered. If so, use it. Otherwise compile local schema.
const TempAppointment = mongoose.models.appointment || mongoose.model("appointment", oldAppointmentSchema);

const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

async function runMigration() {
  console.log("Starting DB connection...");
  
  const dbUri = process.env.db_uri;
  if (!dbUri) {
    console.error("❌ Database Connection Error: db_uri is undefined in config.env");
    process.exit(1);
  }

  await mongoose.connect(dbUri);
  console.log("Connected to MongoDB database.");

  // 1. Fetch all appointments
  const allAppointments = await TempAppointment.find({});
  console.log(`Found ${allAppointments.length} total appointment/slot records.`);

  // 2. Separate into vacant and occupied
  const vacantSlots = [];
  const occupiedAppointments = [];

  for (const app of allAppointments) {
    // If the appointment document is old-style and has doctor/clinic fields:
    if (app.doctor && app.clinic && app.date) {
      const hasPatients = app.patient && app.patient.length > 0;
      if (!hasPatients) {
        vacantSlots.push(app);
      } else {
        occupiedAppointments.push(app);
      }
    }
  }

  console.log(`Vacant slots (to delete): ${vacantSlots.length}`);
  console.log(`Occupied slots (to migrate): ${occupiedAppointments.length}`);

  // 3. Delete all vacant slots
  if (vacantSlots.length > 0) {
    const vacantIds = vacantSlots.map((s) => s._id);
    const deleteResult = await TempAppointment.deleteMany({ _id: { $in: vacantIds } });
    console.log(`Successfully deleted ${deleteResult.deletedCount} vacant slot documents from MongoDB.`);
  }

  if (occupiedAppointments.length === 0) {
    console.log("No occupied appointments to migrate. Migration complete!");
    process.exit(0);
  }

  // 4. Group occupied appointments by doctor, clinic, and date (ignoring time)
  const groups = {};
  for (const app of occupiedAppointments) {
    const dateStr = new Date(app.date).toISOString().split("T")[0];
    const key = `${app.doctor}_${app.clinic}_${dateStr}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(app);
  }

  console.log(`Grouped appointments into ${Object.keys(groups).length} unique sessions.`);

  let sessionsCreated = 0;
  let appointmentsMigrated = 0;

  for (const key of Object.keys(groups)) {
    const [doctor, clinic, dateStr] = key.split("_");
    const groupAppointments = groups[key];

    // Find min and max times to determine the start and end of this session
    let minMinutes = 24 * 60;
    let maxMinutes = 0;
    let duration = 30; // default duration

    for (const app of groupAppointments) {
      const mins = timeToMinutes(app.time);
      if (mins < minMinutes) minMinutes = mins;
      if (mins > maxMinutes) maxMinutes = mins;
      if (app.duration) duration = app.duration;
    }

    const sessionStartTime = minutesToTime(minMinutes);
    const sessionEndTime = minutesToTime(maxMinutes + duration);

    // Create ClinicSession
    let session;
    try {
      // Look if session already exists
      session = await ClinicSession.findOne({
        doctor,
        date: new Date(dateStr),
        startTime: sessionStartTime,
      });

      if (!session) {
        session = await ClinicSession.create({
          doctor,
          clinic,
          date: new Date(dateStr),
          startTime: sessionStartTime,
          endTime: sessionEndTime,
          appointmentDuration: duration,
          status: "Open",
        });
        sessionsCreated++;
      }
    } catch (err) {
      console.error(`Failed to create ClinicSession for ${key}: ${err.message}`);
      continue;
    }

    // Update each appointment in the group to match new schema
    for (const app of groupAppointments) {
      // Find the first active/approved registration, fallback to first registration
      const reg = app.patient.find((p) => p.registrationStatus === "approved") || app.patient[0];
      if (!reg || !reg.patientId) {
        // Skip or delete if no valid registration info
        await TempAppointment.deleteOne({ _id: app._id });
        continue;
      }

      const slotIndex = Math.floor((timeToMinutes(app.time) - minMinutes) / duration);
      const appTime = new Date(dateStr);
      const [hours, mins] = app.time.split(":").map(Number);
      appTime.setHours(hours, mins, 0, 0);

      // Set fields and save
      const updateData = {
        session: session._id,
        patient: reg.patientId,
        slotIndex: isNaN(slotIndex) ? 0 : slotIndex,
        appointmentTime: appTime,
        status: app.status || "Scheduled",
        notes: app.notes || reg.symptoms || "",
      };

      // We use direct mongo update to clear old fields (Mongoose schema changes might prevent clearing on standard save)
      await mongoose.connection.collection("appointments").updateOne(
        { _id: app._id },
        {
          $set: updateData,
          $unset: {
            doctor: "",
            clinic: "",
            date: "",
            time: "",
            NumberOfPatients: "",
            MaxNumberOfPatients: "",
            IsFull: "",
          },
        }
      );
      appointmentsMigrated++;
    }
  }

  console.log("\nMigration completed successfully!");
  console.log(`- ClinicSessions created/linked: ${sessionsCreated}`);
  console.log(`- Booked appointments migrated: ${appointmentsMigrated}`);
  
  await mongoose.disconnect();
  console.log("Disconnected from database.");
  process.exit(0);
}

runMigration().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
