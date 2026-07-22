const ApiError = require("../utils/errors/apiError.utils");
const Patient = require("../models/patient.model");
const Appointment = require("../models/appointment.model");

/**
 * Patient Service
 * Handles all business logic related to patient management
 */
class PatientService {
  /**
   * Get all patients with filtering and pagination
   * @param {Object} filter - Filter criteria
   * @param {Object} options - Query options (limit, page, sort)
   * @returns {Object} Patients data with pagination info
   */
  async getAllPatients(filter = {}, options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = -1,
      } = options;
      const skip = (page - 1) * limit;

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder;

      const patients = await Patient.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select("-password"); // Exclude sensitive data

      const total = await Patient.countDocuments(filter);

      return {
        patients,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      throw new ApiError("Failed to fetch patients", 500);
    }
  }

  /**
   * Get patient by ID with optional population
   * @param {string} patientId - Patient ID
   * @param {Array} populate - Fields to populate
   * @returns {Object} Patient data
   */
  async getPatientById(patientId, populate = []) {
    try {
      let query = Patient.findById(patientId).select("-password");

      // Apply population if specified
      if (populate.length > 0) {
        populate.forEach((field) => {
          query = query.populate(field);
        });
      }

      const patient = await query;

      if (!patient) {
        throw new ApiError("Patient not found", 404);
      }

      return patient;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError("Failed to fetch patient", 500);
    }
  }

  /**
   * Create new patient
   * @param {Object} patientData - Patient data
   * @returns {Object} Created patient
   */
  async createPatient(patientData) {
    try {
      // Check if patient with email already exists
      if (patientData.email) {
        const existingPatient = await Patient.findOne({
          email: patientData.email.toLowerCase(),
        });

        if (existingPatient) {
          throw new ApiError("Patient with this email already exists", 400);
        }
      }

      // Check if patient with phone already exists
      if (patientData.phone) {
        const existingPatient = await Patient.findOne({
          phone: patientData.phone,
        });

        if (existingPatient) {
          throw new ApiError(
            "Patient with this phone number already exists",
            400
          );
        }
      }

      // Normalize email
      if (patientData.email) {
        patientData.email = patientData.email.toLowerCase();
      }

      const patient = await Patient.create(patientData);

      // Return patient without sensitive data
      const { password, ...patientWithoutPassword } = patient.toObject(); // eslint-disable-line no-unused-vars
      return patientWithoutPassword;
    } catch (error) {
      if (error.code === 11000) {
        // Handle MongoDB duplicate key error
        const field = Object.keys(error.keyPattern)[0];
        throw new ApiError(`Patient with this ${field} already exists`, 400);
      }

      if (error instanceof ApiError) throw error;
      throw new ApiError("Failed to create patient", 500);
    }
  }

  /**
   * Update patient by ID
   * @param {string} patientId - Patient ID
   * @param {Object} updateData - Update data
   * @returns {Object} Updated patient
   */
  async updatePatient(patientId, updateData) {
    try {
      const patient = await Patient.findById(patientId);
      if (!patient) {
        throw new ApiError("Patient not found", 404);
      }

      // If updating email, check for duplicates
      if (updateData.email && updateData.email !== patient.email) {
        const existingPatient = await Patient.findOne({
          email: updateData.email.toLowerCase(),
          _id: { $ne: patientId },
        });

        if (existingPatient) {
          throw new ApiError("Patient with this email already exists", 400);
        }

        updateData.email = updateData.email.toLowerCase();
      }

      // If updating phone, check for duplicates
      if (updateData.phone && updateData.phone !== patient.phone) {
        const existingPatient = await Patient.findOne({
          phone: updateData.phone,
          _id: { $ne: patientId },
        });

        if (existingPatient) {
          throw new ApiError(
            "Patient with this phone number already exists",
            400
          );
        }
      }

      // Remove sensitive fields from update data
      delete updateData.password;
      delete updateData.role;

      const updatedPatient = await Patient.findByIdAndUpdate(
        patientId,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");

      return updatedPatient;
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw new ApiError(`Patient with this ${field} already exists`, 400);
      }

      if (error instanceof ApiError) throw error;
      throw new ApiError("Failed to update patient", 500);
    }
  }

  /**
   * Delete patient by ID
   * @param {string} patientId - Patient ID
   * @returns {boolean} Success status
   */
  async deletePatient(patientId) {
    try {
      const patient = await Patient.findById(patientId);
      if (!patient) {
        throw new ApiError("Patient not found", 404);
      }

      // Check if patient has any active appointments
      const activeAppointments = await Appointment.find({
        patient: patientId,
        appointmentTime: { $gte: new Date() },
        status: { $ne: "Cancelled" },
      });

      if (activeAppointments.length > 0) {
        throw new ApiError(
          "Cannot delete patient with active appointments. Please cancel appointments first.",
          400
        );
      }

      await Patient.findByIdAndDelete(patientId);
      return true;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError("Failed to delete patient", 500);
    }
  }

  /**
   * Search patients by various criteria
   * @param {Object} searchCriteria - Search criteria
   * @param {Object} options - Query options
   * @returns {Array} Matching patients
   */
  async searchPatients(searchCriteria, options = {}) {
    try {
      const { query, field, dateRange } = searchCriteria;
      const filter = {};

      if (query && field) {
        if (field === "all") {
          // Search across multiple fields
          filter.$or = [
            { name: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
            { phone: { $regex: query, $options: "i" } },
            { nationalId: { $regex: query, $options: "i" } },
          ];
        } else {
          // Search specific field
          filter[field] = { $regex: query, $options: "i" };
        }
      }

      if (dateRange) {
        if (dateRange.from) {
          filter.createdAt = { $gte: new Date(dateRange.from) };
        }
        if (dateRange.to) {
          filter.createdAt = {
            ...filter.createdAt,
            $lte: new Date(dateRange.to),
          };
        }
      }

      return await this.getAllPatients(filter, options);
    } catch (error) {
      throw new ApiError("Failed to search patients", 500);
    }
  }

  /**
   * Get patient's appointment history
   * @param {string} patientId - Patient ID
   * @param {Object} options - Query options
   * @returns {Array} Patient's appointment history
   */
  async getPatientAppointmentHistory(patientId, options = {}) {
    try {
      const patient = await Patient.findById(patientId);
      if (!patient) {
        throw new ApiError("Patient not found", 404);
      }

      const { status, dateRange } = options;
      const filter = { patient: patientId };

      if (status) {
        filter.status = status;
      }

      // Filter by appointment date range
      if (dateRange) {
        if (dateRange.from) {
          filter.appointmentTime = { $gte: new Date(dateRange.from) };
        }
        if (dateRange.to) {
          filter.appointmentTime = { ...filter.appointmentTime, $lte: new Date(dateRange.to) };
        }
      }

      let appointments = await Appointment.find(filter)
        .populate({
          path: "session",
          populate: [
            { path: "doctor", select: "fullName specialization" },
            { path: "clinic", select: "name" },
          ],
        })
        .sort({ appointmentTime: -1 });

      return appointments;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError("Failed to fetch patient appointment history", 500);
    }
  }

  /**
   * Update patient profile image
   * @param {string} patientId - Patient ID
   * @param {string} imagePath - Image file path
   * @returns {Object} Updated patient
   */
  async updatePatientImage(patientId, imagePath) {
    try {
      const patient = await Patient.findById(patientId);
      if (!patient) {
        throw new ApiError("Patient not found", 404);
      }

      const updatedPatient = await Patient.findByIdAndUpdate(
        patientId,
        { profileImg: imagePath },
        { new: true }
      ).select("-password");

      return updatedPatient;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError("Failed to update patient image", 500);
    }
  }

  /**
   * Get patient statistics
   * @returns {Object} Patient statistics
   */
  async getPatientStatistics() {
    try {
      const totalPatients = await Patient.countDocuments();
      const activePatients = await Patient.countDocuments({
        isActive: true,
      });

      // Get registration trends (last 6 months)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const registrationTrends = await Patient.aggregate([
        {
          $match: {
            createdAt: { $gte: sixMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
        },
      ]);

      return {
        total: totalPatients,
        active: activePatients,
        inactive: totalPatients - activePatients,
        registrationTrends,
      };
    } catch (error) {
      throw new ApiError("Failed to fetch patient statistics", 500);
    }
  }
}

module.exports = new PatientService();
