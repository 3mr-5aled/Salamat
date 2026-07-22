const ApiError = require("../utils/errors/apiError.utils");
const errorCodes = require("../utils/errors/errorCodes");

const sendErrorForDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    errorCode: err.errorCode || null,
    stack: err.stack,
    ...(err.validationErrors && { errors: err.validationErrors }),
  });
};

const sendErrorForProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errorCode: err.errorCode || null,
      ...(err.validationErrors && { errors: err.validationErrors }),
    });
  }

  // Programming or other unknown error: don't leak error details
  console.error("ERROR 💥", err);
  return res.status(500).json({
    status: "error",
    message: "Something went wrong!",
    errorCode: errorCodes.SYSTEM_ERRORS.DATABASE_CONNECTION_FAILED.code,
  });
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return ApiError.fromErrorCode(
    errorCodes.VALIDATION_ERRORS.INVALID_ID_FORMAT,
    message
  );
};

const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];

  let errorObj;
  if (field === "email") {
    errorObj = errorCodes.RESOURCE_ERRORS.DUPLICATE_EMAIL;
  } else if (field === "phone") {
    errorObj = errorCodes.RESOURCE_ERRORS.DUPLICATE_PHONE;
  } else {
    errorObj = errorCodes.RESOURCE_ERRORS.RESOURCE_ALREADY_EXISTS;
  }

  const message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists`;
  return ApiError.fromErrorCode(errorObj, message);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => ({
    field: el.path,
    message: el.message,
    value: el.value,
  }));

  const message = "Invalid input data";
  const error = ApiError.fromErrorCode(
    errorCodes.VALIDATION_ERRORS.REQUIRED_FIELD_MISSING,
    message
  );
  error.validationErrors = errors;
  return error;
};

const handleJWTError = () =>
  ApiError.fromErrorCode(errorCodes.AUTH_ERRORS.INVALID_TOKEN);

const handleJWTExpiredError = () =>
  ApiError.fromErrorCode(errorCodes.AUTH_ERRORS.TOKEN_EXPIRED);

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorForProd(error, res);
  }
};

module.exports = globalError;
