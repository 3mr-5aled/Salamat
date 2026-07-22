/**
 * Collection of utility helper functions
 */

const Clinic = require("../../models/clinic.model");

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format (supports various formats)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone format
 */
const isValidPhone = (phone) => {
  // Supports formats: +1234567890, 123-456-7890, (123) 456-7890, etc.
  const phoneRegex =
    /^[\+]?[1-9][\d]{0,15}$|^[\(]?[0-9]{3}[\)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)\.]/g, ""));
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and requirements
 */
const validatePasswordStrength = (password) => {
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChars: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isValid = Object.values(requirements).every((req) => req === true);

  return {
    isValid,
    requirements,
    score: Object.values(requirements).filter((req) => req === true).length,
  };
};

/**
 * Sanitize input string to prevent XSS
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 */
const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;

  return input
    .replace(/[<>]/g, "") // Remove < and >
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .trim();
};

/**
 * Generate random string of specified length
 * @param {number} length - Length of random string
 * @param {string} charset - Character set to use (default: alphanumeric)
 * @returns {string} Random string
 */
const generateRandomString = (
  length = 10,
  charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
) => {
  let result = "";
  for (let i = 0; i < length; i += 1) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
};

/**
 * Generate random number between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 */
const generateRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Convert string to slug format
 * @param {string} text - Text to convert to slug
 * @returns {string} Slug format string
 */
const createSlug = (text) =>
  text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
const deepClone = (obj) => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item));
  }

  const cloned = {};
  Object.keys(obj).forEach((key) => {
    cloned[key] = deepClone(obj[key]);
  });

  return cloned;
};

/**
 * Check if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean} True if object is empty
 */
const isEmpty = (obj) => {
  if (obj === null || obj === undefined) return true;
  if (typeof obj === "string" || Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === "object") return Object.keys(obj).length === 0;
  return false;
};

/**
 * Capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
const capitalizeWords = (str) =>
  str.replace(/\b\w/g, (char) => char.toUpperCase());

/**
 * Truncate string to specified length with ellipsis
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated string
 */
const truncateString = (str, maxLength, suffix = "...") => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Format file size in human readable format
 * @param {number} bytes - File size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted file size
 */
const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Debounce function execution
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

/**
 * Throttle function execution
 * @param {Function} func - Function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Throttled function
 */
const throttle = (func, delay) => {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return func.apply(this, args);
    }
  };
};

/**
 * Format currency value
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @param {string} locale - Locale string (default: 'en-US')
 * @returns {string} Formatted currency string
 */
const formatCurrency = (amount, currency = "USD", locale = "en-US") =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);

/**
 * Calculate age from date of birth
 * @param {Date|string} dateOfBirth - Date of birth
 * @returns {number} Age in years
 */
const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age;
};

/**
 * Remove undefined and null values from object
 * @param {Object} obj - Object to clean
 * @returns {Object} Cleaned object
 */
const removeEmptyValues = (obj) =>
  Object.keys(obj).reduce((cleaned, key) => {
    const value = obj[key];
    if (value !== null && value !== undefined) {
      if (typeof value === "object" && !Array.isArray(value)) {
        const cleanedNested = removeEmptyValues(value);
        if (!isEmpty(cleanedNested)) {
          cleaned[key] = cleanedNested;
        }
      } else {
        cleaned[key] = value;
      }
    }
    return cleaned;
  }, {});

/**
 * Checks if documents exist in the database by their ObjectIds
 * @param {Object} Model - Mongoose model to query against
 * @param {string|string[]} ObjectId - Single ObjectId or array of ObjectIds to check for existence
 * @param {string} modelName - Name of the model for error messaging
 * @returns {Promise<void>} Resolves if all documents exist, rejects with error if any are missing
 */
const checkExists = (Model, ObjectId, modelName = "") =>
  Model.findById({ _id: { $exists: true, $in: ObjectId } }).then((result) => {
    if (result.length < 1 || result.length !== ObjectId.length) {
      return Promise.reject(new Error(`${modelName} not found`));
    }
  });

/**
 * Set image URL for documents with image fields
 * @param {Object} doc - Document object
 * @param {string} uploadPath - Upload path for images
 * @param {string} fieldName - Field name containing image
 * @param {string} groupName - Group name for multiple images
 * @param {boolean} multiple - Whether handling multiple images
 */
const setImageURL = (
  doc,
  uploadPath,
  fieldName,
  groupName,
  multiple = false
) => {
  if (doc[fieldName]) {
    const imageUrl = `${process.env.BASE_URL}/${uploadPath}/${doc[fieldName]}`;
    doc[fieldName] = imageUrl;
  }
  if (multiple) {
    if (doc[groupName]) {
      const imagesList = [];
      doc[groupName].forEach((image) => {
        const imageUrl = `${process.env.BASE_URL}/${uploadPath}/${image}`;
        imagesList.push(imageUrl);
      });
      doc[groupName] = imagesList;
    }
  }
};

/**
 * Check if clinics exist (specific helper for doctor validation)
 * @param {Array} clinicIds - Array of clinic IDs
 * @returns {Promise<boolean>} True if all clinics exist
 */
const checkClinicsExists = async (clinicIds) => {
  if (!clinicIds || !Array.isArray(clinicIds) || clinicIds.length === 0) {
    return true; // Empty array is considered valid
  }

  try {
    const existingClinics = await Clinic.find({
      _id: { $in: clinicIds },
    }).select("_id");

    return existingClinics.length === clinicIds.length;
  } catch (error) {
    // Log error but don't throw to allow validation to continue
    return false;
  }
};

module.exports = {
  isValidEmail,
  isValidPhone,
  validatePasswordStrength,
  sanitizeInput,
  generateRandomString,
  generateRandomNumber,
  createSlug,
  deepClone,
  isEmpty,
  capitalizeWords,
  truncateString,
  formatFileSize,
  debounce,
  throttle,
  formatCurrency,
  calculateAge,
  removeEmptyValues,
  checkExists,
  setImageURL,
  checkClinicsExists,
};
