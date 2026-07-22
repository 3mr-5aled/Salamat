const jwt = require("jsonwebtoken");

/**
 * Generate JWT Token
 * @param {string} payload - User ID
 * @returns {string} JWT Token
 */
const createToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

module.exports = createToken;
