/**
 * Custom API Error class for handling operational errors
 */
class ApiError extends Error {
  constructor(message, statusCode, errorCode = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.errorCode = errorCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Helper method to create an ApiError from a standard error code object
   * @param {Object} errorObj - The error object from errorCodes.js
   * @param {string} [customMessage] - Optional custom message to override the default
   * @returns {ApiError}
   */
  static fromErrorCode(errorObj, customMessage = null) {
    return new ApiError(
      customMessage || errorObj.message,
      errorObj.statusCode,
      errorObj.code
    );
  }
}

module.exports = ApiError;
