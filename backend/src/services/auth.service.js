const ApiError = require("../utils/errors/apiError.utils");
const Patient = require("../models/patient.model");
const Doctor = require("../models/doctor.model");

/**
 * Authentication Service
 * Handles all business logic related to authentication and authorization
 */
class AuthService {
  /**
   * Validate user credentials and generate token
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} role - User role (patient, doctor, admin)
   * @returns {Object} User data with token
   */
  async loginUser(email, password, role) {
    // Business logic for user login
    // This would typically be moved from auth.controller.js

    let Model;
    switch (role) {
      case "patient":
        Model = Patient;
        break;
      case "doctor":
        Model = Doctor;
        break;
      case "admin":
        // Admin model would be here
        throw new ApiError("Admin login not implemented", 400);
      default:
        throw new ApiError("Invalid role specified", 400);
    }

    const user = await Model.findOne({ email });
    if (!user) {
      throw new ApiError("Invalid email or password", 401);
    }

    // Additional business logic would go here
    return user;
  }

  /**
   * Register new user with role-based validation
   * @param {Object} userData - User registration data
   * @param {string} role - User role
   * @returns {Object} Created user data
   */
  async registerUser(userData, role) {
    // Business logic for user registration
    // Move from auth.controller.js

    let Model;
    switch (role) {
      case "patient":
        Model = Patient;
        break;
      case "doctor":
        Model = Doctor;
        break;
      default:
        throw new ApiError("Invalid role for registration", 400);
    }

    // Check if user already exists
    const existingUser = await Model.findOne({ email: userData.email });
    if (existingUser) {
      throw new ApiError("User already exists with this email", 400);
    }

    // Create new user
    const newUser = await Model.create(userData);
    return newUser;
  }

  /**
   * Validate user permissions for resource access
   * @param {string} userId - User ID
   * @param {string} role - User role
   * @param {string} resource - Resource being accessed
   * @param {string} action - Action being performed
   * @returns {boolean} Permission granted
   */
  async validatePermission(userId, role, resource, action) {
    // Business logic for permission validation
    // This creates a centralized permission system

    const permissions = {
      admin: {
        appointment: [
          "create",
          "read",
          "update",
          "delete",
          "approve",
          "reject",
        ],
        patient: ["create", "read", "update", "delete"],
        doctor: ["create", "read", "update", "delete"],
      },
      doctor: {
        appointment: ["read", "update"],
        patient: ["read", "update"],
      },
      patient: {
        appointment: ["create", "read"],
        profile: ["read", "update"],
      },
    };

    const rolePermissions = permissions[role];
    if (!rolePermissions || !rolePermissions[resource]) {
      return false;
    }

    return rolePermissions[resource].includes(action);
  }
}

module.exports = new AuthService();
