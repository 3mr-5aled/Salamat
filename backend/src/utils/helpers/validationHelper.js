const ApiError = require("../errors/apiError.utils");

/**
 * Validation Helper Utilities
 * Collection of validation functions for data validation
 */

/**
 * Validate required fields in an object
 * @param {Object} data - Data object to validate
 * @param {Array} requiredFields - Array of required field names
 * @throws {ApiError} If any required field is missing
 */
const validateRequiredFields = (data, requiredFields) => {
  const missingFields = [];

  requiredFields.forEach((field) => {
    if (
      data[field] === undefined ||
      data[field] === null ||
      data[field] === ""
    ) {
      missingFields.push(field);
    }
  });

  if (missingFields.length > 0) {
    throw new ApiError(
      `Missing required fields: ${missingFields.join(", ")}`,
      400
    );
  }
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @throws {ApiError} If email format is invalid
 */
const validateEmail = (email) => {
  if (!email || typeof email !== "string") {
    throw new ApiError("Email is required and must be a string", 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError("Invalid email format", 400);
  }
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @throws {ApiError} If phone format is invalid
 */
const validatePhone = (phone) => {
  if (!phone || typeof phone !== "string") {
    throw new ApiError("Phone number is required and must be a string", 400);
  }

  // Remove all non-digit characters for validation
  const cleanPhone = phone.replace(/\D/g, "");

  if (cleanPhone.length < 10 || cleanPhone.length > 15) {
    throw new ApiError("Phone number must be between 10 and 15 digits", 400);
  }
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @param {Object} requirements - Password requirements
 * @throws {ApiError} If password doesn't meet requirements
 */
const validatePassword = (password, requirements = {}) => {
  const {
    minLength = 8,
    maxLength = 128,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true,
  } = requirements;

  if (!password || typeof password !== "string") {
    throw new ApiError("Password is required and must be a string", 400);
  }

  const errors = [];

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }

  if (password.length > maxLength) {
    errors.push(`Password must not exceed ${maxLength} characters`);
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (requireNumbers && !/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  if (errors.length > 0) {
    throw new ApiError(`Password validation failed: ${errors.join(", ")}`, 400);
  }
};

/**
 * Validate date format and range
 * @param {string|Date} date - Date to validate
 * @param {Object} options - Validation options
 * @throws {ApiError} If date is invalid
 */
const validateDate = (date, options = {}) => {
  const {
    required = false,
    minDate = null,
    maxDate = null,
    allowPast = true,
    allowFuture = true,
  } = options;

  if (!date && required) {
    throw new ApiError("Date is required", 400);
  }

  if (!date && !required) {
    return; // Optional field, skip validation
  }

  const dateObj = new Date(date);

  if (Number.isNaN(dateObj.getTime())) {
    throw new ApiError("Invalid date format", 400);
  }

  const now = new Date();

  if (!allowPast && dateObj < now) {
    throw new ApiError("Date cannot be in the past", 400);
  }

  if (!allowFuture && dateObj > now) {
    throw new ApiError("Date cannot be in the future", 400);
  }

  if (minDate && dateObj < new Date(minDate)) {
    throw new ApiError(
      `Date cannot be before ${new Date(minDate).toDateString()}`,
      400
    );
  }

  if (maxDate && dateObj > new Date(maxDate)) {
    throw new ApiError(
      `Date cannot be after ${new Date(maxDate).toDateString()}`,
      400
    );
  }
};

/**
 * Validate MongoDB ObjectId format
 * @param {string} id - ID to validate
 * @param {string} fieldName - Name of the field for error message
 * @throws {ApiError} If ID format is invalid
 */
const validateMongoId = (id, fieldName = "ID") => {
  if (!id) {
    throw new ApiError(`${fieldName} is required`, 400);
  }

  const mongoIdRegex = /^[a-fA-F0-9]{24}$/;
  if (!mongoIdRegex.test(id)) {
    throw new ApiError(`Invalid ${fieldName} format`, 400);
  }
};

/**
 * Validate string length
 * @param {string} str - String to validate
 * @param {Object} options - Validation options
 * @throws {ApiError} If string doesn't meet length requirements
 */
const validateStringLength = (str, options = {}) => {
  const {
    fieldName = "Field",
    minLength = 0,
    maxLength = Infinity,
    required = false,
  } = options;

  if (!str && required) {
    throw new ApiError(`${fieldName} is required`, 400);
  }

  if (!str && !required) {
    return; // Optional field, skip validation
  }

  if (typeof str !== "string") {
    throw new ApiError(`${fieldName} must be a string`, 400);
  }

  if (str.length < minLength) {
    throw new ApiError(
      `${fieldName} must be at least ${minLength} characters long`,
      400
    );
  }

  if (str.length > maxLength) {
    throw new ApiError(
      `${fieldName} must not exceed ${maxLength} characters`,
      400
    );
  }
};

/**
 * Validate number range
 * @param {number} num - Number to validate
 * @param {Object} options - Validation options
 * @throws {ApiError} If number is not within valid range
 */
const validateNumber = (num, options = {}) => {
  const {
    fieldName = "Number",
    min = -Infinity,
    max = Infinity,
    required = false,
    integer = false,
  } = options;

  if (num === undefined || num === null) {
    if (required) {
      throw new ApiError(`${fieldName} is required`, 400);
    }
    return; // Optional field, skip validation
  }

  if (typeof num !== "number" || Number.isNaN(num)) {
    throw new ApiError(`${fieldName} must be a valid number`, 400);
  }

  if (integer && !Number.isInteger(num)) {
    throw new ApiError(`${fieldName} must be an integer`, 400);
  }

  if (num < min) {
    throw new ApiError(`${fieldName} must be at least ${min}`, 400);
  }

  if (num > max) {
    throw new ApiError(`${fieldName} must not exceed ${max}`, 400);
  }
};

/**
 * Validate array
 * @param {Array} arr - Array to validate
 * @param {Object} options - Validation options
 * @throws {ApiError} If array doesn't meet requirements
 */
const validateArray = (arr, options = {}) => {
  const {
    fieldName = "Array",
    minLength = 0,
    maxLength = Infinity,
    required = false,
    itemValidator = null,
  } = options;

  if (!arr && required) {
    throw new ApiError(`${fieldName} is required`, 400);
  }

  if (!arr && !required) {
    return; // Optional field, skip validation
  }

  if (!Array.isArray(arr)) {
    throw new ApiError(`${fieldName} must be an array`, 400);
  }

  if (arr.length < minLength) {
    throw new ApiError(
      `${fieldName} must contain at least ${minLength} items`,
      400
    );
  }

  if (arr.length > maxLength) {
    throw new ApiError(
      `${fieldName} must not contain more than ${maxLength} items`,
      400
    );
  }

  // Validate each item if validator is provided
  if (itemValidator && typeof itemValidator === "function") {
    arr.forEach((item, index) => {
      try {
        itemValidator(item);
      } catch (error) {
        throw new ApiError(`${fieldName}[${index}]: ${error.message}`, 400);
      }
    });
  }
};

/**
 * Validate enum value
 * @param {*} value - Value to validate
 * @param {Array} allowedValues - Array of allowed values
 * @param {Object} options - Validation options
 * @throws {ApiError} If value is not in allowed values
 */
const validateEnum = (value, allowedValues, options = {}) => {
  const {
    fieldName = "Field",
    required = false,
    caseSensitive = true,
  } = options;

  if (value === undefined || value === null) {
    if (required) {
      throw new ApiError(`${fieldName} is required`, 400);
    }
    return; // Optional field, skip validation
  }

  let isValid;
  if (caseSensitive) {
    isValid = allowedValues.includes(value);
  } else {
    isValid = allowedValues
      .map((v) => v.toString().toLowerCase())
      .includes(value.toString().toLowerCase());
  }

  if (!isValid) {
    throw new ApiError(
      `${fieldName} must be one of: ${allowedValues.join(", ")}`,
      400
    );
  }
};

/**
 * Validate file upload
 * @param {Object} file - File object
 * @param {Object} options - Validation options
 * @throws {ApiError} If file doesn't meet requirements
 */
const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ["image/jpeg", "image/png", "image/gif"],
    required = false,
  } = options;

  if (!file && required) {
    throw new ApiError("File is required", 400);
  }

  if (!file && !required) {
    return; // Optional field, skip validation
  }

  if (!file.mimetype || !allowedTypes.includes(file.mimetype)) {
    throw new ApiError(
      `File type not allowed. Allowed types: ${allowedTypes.join(", ")}`,
      400
    );
  }

  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    throw new ApiError(
      `File size too large. Maximum size: ${maxSizeMB}MB`,
      400
    );
  }
};

/**
 * Validate age
 * @param {Date|string} dateOfBirth - Date of birth
 * @param {Object} options - Validation options
 * @throws {ApiError} If age doesn't meet requirements
 */
const validateAge = (dateOfBirth, options = {}) => {
  const { minAge = 0, maxAge = 150, required = false } = options;

  if (!dateOfBirth && required) {
    throw new ApiError("Date of birth is required", 400);
  }

  if (!dateOfBirth && !required) {
    return; // Optional field, skip validation
  }

  const birthDate = new Date(dateOfBirth);

  if (Number.isNaN(birthDate.getTime())) {
    throw new ApiError("Invalid date of birth format", 400);
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  if (age < minAge) {
    throw new ApiError(`Age must be at least ${minAge} years`, 400);
  }

  if (age > maxAge) {
    throw new ApiError(`Age must not exceed ${maxAge} years`, 400);
  }
};

/**
 * Validate appointment data
 * @param {Object} appointmentData - Appointment data to validate
 * @throws {ApiError} If appointment data is invalid
 */
const validateAppointmentData = (appointmentData) => {
  // Validate required fields
  validateRequiredFields(appointmentData, [
    "title",
    "date",
    "time",
    "MaxNumberOfPatients",
  ]);

  // Validate date
  validateDate(appointmentData.date, {
    required: true,
    allowPast: false, // Don't allow past appointments
  });

  // Validate max patients
  validateNumber(appointmentData.MaxNumberOfPatients, {
    fieldName: "Maximum number of patients",
    min: 1,
    max: 100,
    integer: true,
    required: true,
  });

  // Validate priority if provided
  if (appointmentData.priority !== undefined) {
    validateEnum(appointmentData.priority, ["low", "medium", "high"], {
      fieldName: "Priority",
      caseSensitive: false,
    });
  }

  // Validate time format
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(appointmentData.time)) {
    throw new ApiError("Invalid time format. Use HH:MM format", 400);
  }
};

module.exports = {
  validateRequiredFields,
  validateEmail,
  validatePhone,
  validatePassword,
  validateDate,
  validateMongoId,
  validateStringLength,
  validateNumber,
  validateArray,
  validateEnum,
  validateFile,
  validateAge,
  validateAppointmentData,
};
