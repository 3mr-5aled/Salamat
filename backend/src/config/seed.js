const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const Clinic = require("../models/clinic.model");
const logger = require("../utils/logger.utils");

dotenv.config({ path: path.join(__dirname, "../../config.env") });

const clinicsData = [
  { name: "Cardiology Clinic", clinicNumber: "CL-001", specialty: "Cardiology", description: "Specialized in heart health and cardiovascular treatments.", floor: "3", roomNumber: "301" },
  { name: "Pediatrics Clinic", clinicNumber: "CL-002", specialty: "Pediatrics", description: "Comprehensive healthcare for infants, children, and adolescents.", floor: "2", roomNumber: "205" },
  { name: "Orthopedics Clinic", clinicNumber: "CL-003", specialty: "Orthopedics", description: "Treatment of musculoskeletal system disorders, bones, and joints.", floor: "4", roomNumber: "410" },
  { name: "Oncology Clinic", clinicNumber: "CL-004", specialty: "Oncology", description: "Diagnosis, treatment, and support for cancer patients.", floor: "5", roomNumber: "502" },
  { name: "Neurology Clinic", clinicNumber: "CL-005", specialty: "Neurology", description: "Treatment of brain, spinal cord, and nervous system disorders.", floor: "4", roomNumber: "415" },
  { name: "Obstetrics and Gynecology Clinic", clinicNumber: "CL-006", specialty: "Obstetrics and Gynecology", description: "Care for women during pregnancy, childbirth, and female reproductive health.", floor: "2", roomNumber: "210" },
  { name: "Dermatology Clinic", clinicNumber: "CL-007", specialty: "Dermatology", description: "Diagnosis and treatment of skin, hair, and nail conditions.", floor: "1", roomNumber: "108" },
  { name: "Ophthalmology Clinic", clinicNumber: "CL-008", specialty: "Ophthalmology", description: "Eye care, vision testing, and treatment of eye diseases.", floor: "1", roomNumber: "115" },
  { name: "ENT (Otolaryngology) Clinic", clinicNumber: "CL-009", specialty: "ENT (Otolaryngology)", description: "Treatment of ear, nose, throat, and related structures.", floor: "1", roomNumber: "120" },
  { name: "Dental Clinic", clinicNumber: "CL-010", specialty: "Dental", description: "Oral health, teeth cleaning, fillings, and dental surgeries.", floor: "Ground", roomNumber: "G05" },
  { name: "Internal Medicine Clinic", clinicNumber: "CL-011", specialty: "Internal Medicine", description: "Prevention, diagnosis, and treatment of adult internal diseases.", floor: "3", roomNumber: "312" }
];

const User = require("../models/user.model");

const seedDatabase = async () => {
  try {
    const dbUri = process.env.db_uri;
    if (!dbUri) {
      throw new Error("db_uri environment variable is not defined in config.env");
    }

    const dbName = process.env.dbname || "Salamat";
    mongoose.set("strictQuery", false);
    await mongoose.connect(dbUri, { dbName });
    logger.info(`Connected to database '${dbName}' for seeding.`);

    // Seed Clinics
    const clinicCount = await Clinic.countDocuments();
    if (clinicCount === 0) {
      await Clinic.insertMany(clinicsData);
      logger.info(`Successfully seeded ${clinicsData.length} clinics into the database.`);
    } else {
      logger.info("Clinics database already contains data. Skipped seeding clinics.");
    }

    // Seed Admin User
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount === 0) {
      await User.create({
        name: "Admin 1",
        email: "admin@salamat.com",
        password: "AdminPassword123",
        role: "admin",
        phone: "01001234567",
        isVerified: true,
      });
      logger.info("Successfully seeded default admin user (admin@salamat.com / AdminPassword123, phone: 01001234567).");
    } else {
      logger.info("Admin user already exists. Skipped seeding admin.");
    }

    process.exit(0);
  } catch (error) {
    logger.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
