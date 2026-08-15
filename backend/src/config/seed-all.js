const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

const Clinic = require("../models/clinic.model");
const User = require("../models/user.model");
const Doctor = require("../models/doctor.model");
const Patient = require("../models/patient.model");
const ClinicSession = require("../models/clinicSession.model");
const Appointment = require("../models/appointment.model");
const AdminMessage = require("../models/adminMessage.model");
const Notification = require("../models/notification.model");

const logger = require("../utils/logger.utils");

dotenv.config({ path: path.join(__dirname, "../../config.env") });

const clinicsData = [
  {
    name: "Cardiology Clinic",
    clinicNumber: "CL-001",
    specialty: "Cardiology",
    description: "Specialized in heart health, cardiovascular diagnostics, and hypertension management.",
    floor: "3",
    roomNumber: "301",
  },
  {
    name: "Pediatrics Clinic",
    clinicNumber: "CL-002",
    specialty: "Pediatrics",
    description: "Comprehensive healthcare, growth tracking, and pediatric consultations for children.",
    floor: "2",
    roomNumber: "205",
  },
  {
    name: "Orthopedics Clinic",
    clinicNumber: "CL-003",
    specialty: "Orthopedics",
    description: "Treatment of musculoskeletal disorders, joint therapies, and sports injuries.",
    floor: "4",
    roomNumber: "410",
  },
  {
    name: "Oncology Clinic",
    clinicNumber: "CL-004",
    specialty: "Oncology",
    description: "Cancer treatments, chemotherapy coordination, and specialized oncology care.",
    floor: "5",
    roomNumber: "502",
  },
  {
    name: "Neurology Clinic",
    clinicNumber: "CL-005",
    specialty: "Neurology",
    description: "Nervous system diagnostics, stroke recovery, and neurological disorder treatments.",
    floor: "4",
    roomNumber: "415",
  },
];

const seedAll = async () => {
  try {
    const dbUri = process.env.db_uri;
    if (!dbUri) throw new Error("db_uri environment variable is not defined.");

    const dbName = process.env.dbname || "Salamat";
    mongoose.set("strictQuery", false);
    await mongoose.connect(dbUri, { dbName });
    logger.info(`Connected to DB '${dbName}' for master seeding.`);

    // Clear all existing data from collections
    await Promise.all([
      Clinic.deleteMany(),
      User.deleteMany(),
      Doctor.deleteMany(),
      Patient.deleteMany(),
      ClinicSession.deleteMany(),
      Appointment.deleteMany(),
      AdminMessage.deleteMany(),
      Notification.deleteMany(),
    ]);
    logger.info("Cleared all existing database collections.");

    // 1. Seed Clinics
    const createdClinics = await Clinic.insertMany(clinicsData);
    logger.info("Seeded 5 clinics across major hospital specialties.");

    // 2. Seed Admin Users
    const adminUser1 = await User.create({
      name: "Admin 1",
      email: "admin@salamat.com",
      password: "AdminPassword123",
      role: "admin",
      phone: "01001234567",
      isVerified: true,
    });

    await User.create({
      name: "Hassan El-Shamy",
      email: "admin2@salamat.com",
      password: "AdminPassword123",
      role: "admin",
      phone: "01101234567",
      isVerified: true,
    });
    logger.info("Seeded admin users.");

    // 3. Seed Doctor Users and Profiles across all specialties
    const docsInfo = [
      {
        name: "Dr. Ahmed Hassan",
        email: "dr.ahmed@salamat.com",
        specialty: "Cardiology",
        phone: "01201234567",
        gender: "male",
        clinic: createdClinics[0]._id, // Cardiology
        availability: [
          { dayOfWeek: "Monday", startTime: "09:00", endTime: "17:00" },
          { dayOfWeek: "Wednesday", startTime: "09:00", endTime: "17:00" },
          { dayOfWeek: "Friday", startTime: "09:00", endTime: "17:00" },
        ],
      },
      {
        name: "Dr. Tarek Hegazi",
        email: "dr.tarek@salamat.com",
        specialty: "Pediatrics",
        phone: "01501234567",
        gender: "male",
        clinic: createdClinics[1]._id, // Pediatrics
        availability: [
          { dayOfWeek: "Sunday", startTime: "10:00", endTime: "16:00" },
          { dayOfWeek: "Tuesday", startTime: "10:00", endTime: "16:00" },
          { dayOfWeek: "Thursday", startTime: "10:00", endTime: "16:00" },
        ],
      },
      {
        name: "Dr. Laila Abdel-Rahman",
        email: "dr.laila@salamat.com",
        specialty: "Orthopedics",
        phone: "01007654321",
        gender: "female",
        clinic: createdClinics[2]._id, // Orthopedics
        availability: [
          { dayOfWeek: "Monday", startTime: "09:00", endTime: "15:00" },
          { dayOfWeek: "Tuesday", startTime: "09:00", endTime: "15:00" },
          { dayOfWeek: "Thursday", startTime: "09:00", endTime: "15:00" },
        ],
      },
      {
        name: "Dr. Mona Mansour",
        email: "dr.mona@salamat.com",
        specialty: "Oncology",
        phone: "01123456789",
        gender: "female",
        clinic: createdClinics[3]._id, // Oncology
        availability: [
          { dayOfWeek: "Wednesday", startTime: "11:00", endTime: "17:00" },
          { dayOfWeek: "Friday", startTime: "11:00", endTime: "17:00" },
          { dayOfWeek: "Saturday", startTime: "10:00", endTime: "16:00" },
        ],
      },
      {
        name: "Dr. Youssef Nabil",
        email: "dr.youssef@salamat.com",
        specialty: "Neurology",
        phone: "01234567890",
        gender: "male",
        clinic: createdClinics[4]._id, // Neurology
        availability: [
          { dayOfWeek: "Sunday", startTime: "09:00", endTime: "15:00" },
          { dayOfWeek: "Wednesday", startTime: "09:00", endTime: "15:00" },
          { dayOfWeek: "Thursday", startTime: "09:00", endTime: "15:00" },
        ],
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
        slug: info.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        gender: info.gender,
        specialization: info.specialty,
        clinic: info.clinic,
        yearsOfExperience: 10,
        qualifications: ["MD", "PhD"],
        availability: info.availability,
        isActive: true,
      });

      await Clinic.findByIdAndUpdate(info.clinic, {
        $addToSet: { doctors: d._id },
      });
      createdDoctors.push(d);
    }
    logger.info("Seeded 5 doctor users and profiles with clinic bindings.");

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
      {
        name: "Nour El-Din Khaled",
        email: "nour@salamat.com",
        bloodType: "B+",
        diseases: [],
        phone: "01511223344",
        gender: "male",
        dateOfBirth: "1998-01-15",
        emergencyContact: {
          name: "Salma Khaled",
          relation: "Mother",
          phone: "01011223344",
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
        medicalRecordNumber: "MRN-" + Math.floor(100000 + Math.random() * 900000),
        doctorNotes: [
          {
            doctor: createdDoctors[0]._id,
            notes: "Patient advised to maintain balanced diet and regularly monitor blood pressure.",
            updatedAt: new Date(Date.now() - 86400000),
          },
        ],
      });
      createdPatients.push(p);
    }
    logger.info("Seeded patient users and medical profiles.");

    // 5. Seed Predefined ClinicSessions based on Doctor Availability (from -7 to +14 days relative to now)
    const now = Date.now();
    const createdSessions = [];

    for (const d of createdDoctors) {
      const availabilities = d.availability || [];
      for (let dayOffset = -7; dayOffset <= 14; dayOffset++) {
        const targetDate = new Date(now + dayOffset * 86400000);
        const dayName = targetDate.toLocaleDateString("en-US", { weekday: "long" });

        const matchingAvail = availabilities.find(
          (a) => a.dayOfWeek.toLowerCase() === dayName.toLowerCase()
        );

        if (matchingAvail) {
          const sessionDate = new Date(targetDate);
          sessionDate.setHours(0, 0, 0, 0);

          const session = await ClinicSession.create({
            doctor: d._id,
            clinic: d.clinic,
            date: sessionDate,
            startTime: matchingAvail.startTime || "09:00",
            endTime: matchingAvail.endTime || "17:00",
            appointmentDuration: 15,
            status: "Open",
          });
          createdSessions.push(session);
        }
      }
    }
    logger.info(`Seeded ${createdSessions.length} clinic sessions matching doctors' weekly availability schedules.`);

    // 5b. Seed GUARANTEED demo sessions for Dr. Ahmed Hassan (Cardiology)
    // These ensure Today / Tomorrow always have visible slots during the demo recording,
    // regardless of which day of the week the seed is run.
    const demoDoctorAhmed = createdDoctors[0]; // Dr. Ahmed Hassan — Cardiology
    const demoDays = [0, 1, 2]; // today, tomorrow, day after tomorrow
    for (const offset of demoDays) {
      const demoDate = new Date(now + offset * 86400000);
      demoDate.setHours(0, 0, 0, 0);

      // Avoid duplicate if the availability loop already created a session on this date
      const alreadyExists = createdSessions.some(
        (s) =>
          s.doctor.toString() === demoDoctorAhmed._id.toString() &&
          new Date(s.date).toDateString() === demoDate.toDateString()
      );

      if (!alreadyExists) {
        const demoSession = await ClinicSession.create({
          doctor: demoDoctorAhmed._id,
          clinic: demoDoctorAhmed.clinic,
          date: demoDate,
          startTime: "09:00",
          endTime: "17:00",
          appointmentDuration: 15,
          status: "Open",
        });
        createdSessions.push(demoSession);
        logger.info(`Seeded guaranteed demo session for Dr. Ahmed Hassan on ${demoDate.toDateString()}.`);
      }
    }
    logger.info("Guaranteed demo sessions seeded for Today, Tomorrow, and Day+2.");

    // 6. Seed Appointments across all status types

    // 6a. Completed Past Appointment (Mohamed Ali with Dr. Ahmed Hassan)
    const pastSession = createdSessions.find(
      (s) => s.doctor.toString() === createdDoctors[0]._id.toString() && s.date.valueOf() < now - 43200000
    );
    if (pastSession) {
      const pastApptTime = new Date(pastSession.date);
      pastApptTime.setHours(9, 0, 0, 0);

      await Appointment.create({
        session: pastSession._id,
        patient: createdPatients[0]._id,
        slotIndex: 0,
        appointmentTime: pastApptTime,
        status: "Completed",
        notes: JSON.stringify({
          dx: "Mild tachycardia. Advised reduction in caffeine intake and routine cardiac monitoring.",
          rx: [
            { m: "Beta-blocker", d: "5mg", f: "Once daily", t: "2 weeks" },
            { m: "Multivitamin Supplement", d: "1 tablet", f: "Once daily", t: "30 days" },
          ],
        }),
        isPaid: true,
      });
    }

    // 6b. Scheduled Upcoming Appointment (Mohamed Ali with Dr. Ahmed Hassan)
    const upcomingSession = createdSessions.find(
      (s) => s.doctor.toString() === createdDoctors[0]._id.toString() && s.date.valueOf() >= now - 43200000
    );
    if (upcomingSession) {
      const apptTime = new Date(upcomingSession.date);
      const [startH] = (upcomingSession.startTime || "09:00").split(":").map(Number);
      apptTime.setHours(startH, 30, 0, 0);

      await Appointment.create({
        session: upcomingSession._id,
        patient: createdPatients[0]._id,
        slotIndex: 2,
        appointmentTime: apptTime,
        status: "Scheduled",
        notes: "Follow-up consultation",
        isPaid: true,
      });

      // 6c. Scheduled Upcoming Appointment (Fatma Ibrahim with Dr. Ahmed Hassan)
      const fatmaApptTime = new Date(upcomingSession.date);
      fatmaApptTime.setHours(startH + 1, 0, 0, 0);

      await Appointment.create({
        session: upcomingSession._id,
        patient: createdPatients[1]._id,
        slotIndex: 4,
        appointmentTime: fatmaApptTime,
        status: "Scheduled",
        notes: "Routine checkup",
        isPaid: true,
      });
    }

    // 6d. Pending Approval Appointment (Nour El-Din Khaled with Dr. Mona Mansour)
    const pendingSession = createdSessions.find(
      (s) => s.doctor.toString() === createdDoctors[3]._id.toString() && s.date.valueOf() > now + 43200000
    );
    if (pendingSession) {
      const pendingTime = new Date(pendingSession.date);
      const [startH] = (pendingSession.startTime || "11:00").split(":").map(Number);
      pendingTime.setHours(startH, 0, 0, 0);

      await Appointment.create({
        session: pendingSession._id,
        patient: createdPatients[2]._id,
        slotIndex: 0,
        appointmentTime: pendingTime,
        status: "Pending",
        notes: "Initial oncology screening consultation request",
        isPaid: false,
      });
    }

    logger.info("Seeded completed, scheduled, and pending appointment records.");

    // 7. Seed Admin Messages (Doctor & Patient Inbox Queries)
    await AdminMessage.create([
      {
        senderName: createdDoctors[0].fullName,
        senderEmail: "dr.ahmed@salamat.com",
        senderRole: "doctor",
        senderId: createdDoctors[0].user,
        message: "Requesting update to cardiology clinic equipment and room 301 schedule maintenance.",
        isRead: false,
      },
      {
        senderName: createdPatients[1].fullName,
        senderEmail: "fatma@salamat.com",
        senderRole: "patient",
        senderId: createdPatients[1].user,
        message: "Inquiring about updating emergency contact details on file.",
        isRead: true,
      },
    ]);
    logger.info("Seeded Admin Messages.");

    // 8. Seed Notifications
    await Notification.create([
      {
        recipient: createdPatients[0].user,
        title: "Appointment Approved",
        message: "Your appointment with Dr. Ahmed Hassan for Cardiology Consultation has been confirmed.",
        type: "appointment_approved",
        isRead: false,
      },
      {
        recipient: createdPatients[1].user,
        title: "Prescription Ready",
        message: "Your consultation summary and digital prescription card are now available.",
        type: "appointment_approved",
        isRead: true,
      },
      {
        recipient: createdDoctors[0].user,
        title: "New Booking Request",
        message: "A new appointment slot has been reserved for Mohamed Ali.",
        type: "appointment_booked",
        isRead: false,
      },
      {
        recipient: adminUser1._id,
        title: "System Health Alert",
        message: "All hospital clinic sessions and appointment slots have been updated successfully.",
        type: "system",
        isRead: false,
      },
    ]);
    logger.info("Seeded Notifications.");

    logger.info("Master Seeding completed successfully with zero errors.");
    process.exit(0);
  } catch (error) {
    logger.error("Error running master seeding script:", error);
    process.exit(1);
  }
};

seedAll();
