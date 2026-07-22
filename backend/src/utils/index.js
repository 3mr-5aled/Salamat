/**
 * Utils Index
 * Centralized exports for all utilities
 */

// Error utilities
const ApiError = require("./errors/apiError.utils");
const errorCodes = require("./errors/errorCodes");

// Helper utilities
const helper = require("./helpers/helper");
const dateHelper = require("./helpers/dateHelper");
const validationHelper = require("./helpers/validationHelper");
const ApiFeatures = require("./helpers/apiFeatures.utils");
const createToken = require("./helpers/createToken.utils");

// Email utilities
const emailUtils = require("./email/sendEmail.utils");

// Logger
const logger = require("./logger.utils");

module.exports = {
  // Error handling
  ApiError,
  errorCodes,

  // Helpers
  helper,
  dateHelper,
  validationHelper,
  ApiFeatures,
  createToken,

  // Email
  emailUtils,

  // Logger
  logger,
};
