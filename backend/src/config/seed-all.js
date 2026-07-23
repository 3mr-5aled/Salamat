const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const Clinic = require("../models/clinic.model");
const User = require("../models/user.model");
const Doctor = require("../models/doctor.model");
const Patient = require("../models/patient.model");
const ClinicSession = require("../models/clinicSession.model");
const Appointment = require("../models/appointment.model");
const logger = require("../utils/logger.utils");

dotenv.config({ path: path.join(__dirname, "../../config.env") });

const clinicsData = [
  {
    name: "Cardiology Clinic",
    clinicNumber: "CL-001",
    specialty: "Cardiology",
    description: "Specialized in heart health.",
    floor: "3",
    roomNumber: "301",
  },
  {
    name: "Pediatrics Clinic",
    clinicNumber: "CL-002",
    specialty: "Pediatrics",
    description: "Comprehensive healthcare for children.",
    floor: "2",
    roomNumber: "205",
  },
  {
    name: "Orthopedics Clinic",
    clinicNumber: "CL-003",
    specialty: "Orthopedics",
    description: "Treatment of musculoskeletal disorders.",
    floor: "4",
    roomNumber: "410",
  },
  {
    name: "Oncology Clinic",
    clinicNumber: "CL-004",
    specialty: "Oncology",
    description: "Cancer treatments.",
    floor: "5",
    roomNumber: "502",
  },
  {
    name: "Neurology Clinic",
    clinicNumber: "CL-005",
    specialty: "Neurology",
    description: "Nervous system treatments.",
    floor: "4",
    roomNumber: "415",
  },
];

const seedAll = async () => {
  try {
    const dbUri = process.env.db_uri;
    if (!dbUri) throw new Error("db_uri environment variable is not defined.");

    await mongoose.connect(dbUri);
    logger.info("Connected to DB for seeding.");

    // Clear all existing data
    await Promise.all([
      Clinic.deleteMany(),
      User.deleteMany(),
      Doctor.deleteMany(),
      Patient.deleteMany(),
      ClinicSession.deleteMany(),
      Appointment.deleteMany(),
    ]);
    logger.info("Cleared existing database records.");

    // 1. Seed Clinics
    const createdClinics = await Clinic.insertMany(clinicsData);
    logger.info("Seeded clinics.");

    // 2. Seed Admin Users
    await User.create([
      {
        name: "Admin 1",
        email: "admin@salamat.com",
        password: "AdminPassword123",
        role: "admin",
        phone: "01001234567",
        isVerified: true,
      },
      {
        name: "Hassan El-Shamy",
        email: "admin2@salamat.com",
        password: "AdminPassword123",
        role: "admin",
        phone: "01101234567",
        isVerified: true,
      },
    ]);
    logger.info("Seeded admin users.");

    // 3. Seed Doctor Users and Profiles
    const docsInfo = [
      {
        name: "Dr. Ahmed Hassan",
        email: "ahmed@salamat.com",
        specialty: "Cardiology",
        phone: "01201234567",
        gender: "male",
        clinic: createdClinics[0]._id,
      },
      {
        name: "Dr. Tarek Hegazi",
        email: "tarek@salamat.com",
        specialty: "Pediatrics",
        phone: "01501234567",
        gender: "male",
        clinic: createdClinics[1]._id,
      },
      {
        name: "Dr. Laila Abdel-Rahman",
        email: "laila@salamat.com",
        specialty: "Orthopedics",
        phone: "01007654321",
        gender: "female",
        clinic: createdClinics[2]._id,
      },
    ];

    const createdDoctors = [];
    for (const info of docsInfo) {
      const u = await User.create({
        name: info.name,
        email: info.email,
        password: "DoctorPassword123",
        role: "doctor",
        phone: info.phone,
        isVerified: true,
      });

      const d = await Doctor.create({
        user: u._id,
        fullName: info.name,
        slug: info.name.toLowerCase().replace(/ /g, "-"),
        gender: info.gender,
        specialization: info.specialty,
        clinic: info.clinic,
        yearsOfExperience: 10,
        qualifications: ["MD", "PhD"],
        availability: [
          { dayOfWeek: "Monday", startTime: "09:00", endTime: "17:00" },
          { dayOfWeek: "Wednesday", startTime: "09:00", endTime: "17:00" },
          { dayOfWeek: "Friday", startTime: "09:00", endTime: "17:00" }
        ],
        isActive: true,
      });

      // Bind doctor back to clinic document
      await Clinic.findByIdAndUpdate(info.clinic, {
        $addToSet: { doctors: d._id },
      });
      createdDoctors.push(d);
    }
    logger.info("Seeded doctor users and profiles.");

    // 4. Seed Patient Users and Profiles
    const patientsInfo = [
      {
        name: "Mohamed Ali",
        email: "mohamed@salamat.com",
        bloodType: "O+",
        diseases: ["Diabetes"],
        phone: "01107654321",
        gender: "male",
        dateOfBirth: "1992-04-12",
        emergencyContact: {
          name: "Ali Mohamed",
          relation: "Father",
          phone: "01007654321",
        },
      },
      {
        name: "Fatma Ibrahim",
        email: "fatma@salamat.com",
        bloodType: "A-",
        diseases: ["Hypertension", "Asthma"],
        phone: "01207654321",
        gender: "female",
        dateOfBirth: "1995-09-23",
        emergencyContact: {
          name: "Ibrahim Hassan",
          relation: "Husband",
          phone: "01507654321",
        },
      },
    ];

    const createdPatients = [];
    for (const info of patientsInfo) {
      const u = await User.create({
        name: info.name,
        email: info.email,
        password: "PatientPassword123",
        role: "patient",
        phone: info.phone,
        isVerified: true,
      });

      const p = await Patient.create({
        user: u._id,
        fullName: info.name,
        gender: info.gender,
        bloodType: info.bloodType,
        chronicDiseases: info.diseases,
        phone: info.phone,
        dateOfBirth: info.dateOfBirth ? new Date(info.dateOfBirth) : undefined,
        emergencyContact: info.emergencyContact,
        medicalRecordNumber:
          "MRN-" + Math.floor(100000 + Math.random() * 900000),
      });
      createdPatients.push(p);
    }
    logger.info("Seeded patient users and profiles.");

    // 5. Seed Predefined ClinicSessions relative to current execution time
    const now = Date.now();
    const dates = [
      new Date(now - 86400000),      // Yesterday (Past)
      new Date(now),                 // Today
      new Date(now + 86400000),      // Tomorrow (Upcoming)
      new Date(now + 2 * 86400000),  // In 2 Days (Upcoming)
    ];

    const createdSessions = [];
    for (const d of createdDoctors) {
      for (const date of dates) {
        const sessionDate = new Date(date);
        sessionDate.setHours(0, 0, 0, 0);

        const session = await ClinicSession.create({
          doctor: d._id,
          clinic: d.clinic,
          date: sessionDate,
          startTime: "09:00",
          endTime: "12:00",
          appointmentDuration: 15,
          status: "Open",
        });
        createdSessions.push(session);
      }
    }
    logger.info("Seeded clinic sessions across Past, Today, and Upcoming dates.");

    // 6. Seed a completed appointment in Past session (Yesterday - session index 0 for Doctor 0)
    const pastSession = createdSessions[0];
    const pastApptTime = new Date(pastSession.date);
    pastApptTime.setHours(9, 0, 0, 0); // 09:00

    await Appointment.create({
      session: pastSession._id,
      patient: createdPatients[0]._id,
      slotIndex: 0,
      appointmentTime: pastApptTime,
      status: "Completed",
      notes: JSON.stringify({
        diagnosis: "Mild tachycardia. Advised reduction in caffeine intake.",
        prescriptions: [
          { m: "Beta-blocker", d: "5mg", f: "Once daily", t: "2 weeks" },
        ],
      }),
      isPaid: true,
    });
    logger.info("Seeded completed past booking record linked to yesterday's session.");

    // 7. Seed a scheduled appointment in Today's session (Today - session index 1 for Doctor 0)
    const todaySession = createdSessions[1];
    const todayApptTime = new Date(todaySession.date);
    todayApptTime.setHours(9, 30, 0, 0); // 09:30

    await Appointment.create({
      session: todaySession._id,
      patient: createdPatients[0]._id,
      slotIndex: 2,
      appointmentTime: todayApptTime,
      status: "Scheduled",
      notes: "Follow-up consultation",
      isPaid: true,
    });
    logger.info("Seeded scheduled appointment for today's session.");

    // 8. Seed an upcoming scheduled appointment (Tomorrow - session index 2 for Doctor 0)
    const upcomingSession = createdSessions[2];
    const upcomingTime = new Date(upcomingSession.date);
    upcomingTime.setHours(10, 0, 0, 0); // 10:00

    await Appointment.create({
      session: upcomingSession._id,
      patient: createdPatients[1]._id,
      slotIndex: 4,
      appointmentTime: upcomingTime,
      status: "Scheduled",
      notes: "Routine checkup",
      isPaid: false,
    });
    logger.info("Seeded upcoming scheduled booking record linked to tomorrow's session.");

    logger.info("Seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    logger.error("Error running seeding script:", error);
    process.exit(1);
  }
};

seedAll();
