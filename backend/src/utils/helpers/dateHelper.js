/* eslint-disable no-case-declarations */
/**
 * Date Helper Utilities
 * Collection of utility functions for date manipulation and formatting
 */

/**
 * Format date to various formats
 * @param {Date|string} date - Date to format
 * @param {string} format - Format type ('short', 'medium', 'long', 'full', 'time', 'datetime')
 * @param {string} locale - Locale string (default: 'en-US')
 * @returns {string} Formatted date string
 */
const formatDate = (date, format = "medium", locale = "en-US") => {
  const dateObj = new Date(date);

  if (Number.isNaN(dateObj.getTime())) {
    throw new Error("Invalid date provided");
  }

  const options = {
    short: { year: "numeric", month: "short", day: "numeric" },
    medium: { year: "numeric", month: "short", day: "numeric" },
    long: { year: "numeric", month: "long", day: "numeric" },
    full: { weekday: "long", year: "numeric", month: "long", day: "numeric" },
    time: { hour: "2-digit", minute: "2-digit", second: "2-digit" },
    datetime: {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  };

  return new Intl.DateTimeFormat(
    locale,
    options[format] || options.medium
  ).format(dateObj);
};

/**
 * Format date for API/database usage (ISO format)
 * @param {Date|string} date - Date to format
 * @returns {string} ISO formatted date string
 */
const toISOString = (date) => {
  const dateObj = new Date(date);

  if (Number.isNaN(dateObj.getTime())) {
    throw new Error("Invalid date provided");
  }

  return dateObj.toISOString();
};

/**
 * Format date for display in local timezone
 * @param {Date|string} date - Date to format
 * @param {string} timeZone - Timezone string (default: local timezone)
 * @returns {string} Formatted date in specified timezone
 */
const formatDateInTimezone = (
  date,
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
) => {
  const dateObj = new Date(date);

  if (Number.isNaN(dateObj.getTime())) {
    throw new Error("Invalid date provided");
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timeZone,
  }).format(dateObj);
};

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 * @param {Date|string} date - Date to compare
 * @param {Date|string} baseDate - Base date for comparison (default: now)
 * @returns {string} Relative time string
 */
const getRelativeTime = (date, baseDate = new Date()) => {
  const dateObj = new Date(date);
  const baseObj = new Date(baseDate);

  if (Number.isNaN(dateObj.getTime()) || Number.isNaN(baseObj.getTime())) {
    throw new Error("Invalid date provided");
  }

  const diffInSeconds = Math.floor((baseObj - dateObj) / 1000);
  const isPast = diffInSeconds > 0;
  const absDiff = Math.abs(diffInSeconds);

  const intervals = [
    { name: "year", seconds: 31536000 },
    { name: "month", seconds: 2592000 },
    { name: "week", seconds: 604800 },
    { name: "day", seconds: 86400 },
    { name: "hour", seconds: 3600 },
    { name: "minute", seconds: 60 },
    { name: "second", seconds: 1 },
  ];

  const matchedInterval = intervals.find((interval) => {
    const count = Math.floor(absDiff / interval.seconds);
    return count >= 1;
  });

  if (matchedInterval) {
    const count = Math.floor(absDiff / matchedInterval.seconds);
    const unit =
      count === 1 ? matchedInterval.name : `${matchedInterval.name}s`;
    return isPast ? `${count} ${unit} ago` : `in ${count} ${unit}`;
  }

  return "just now";
};

/**
 * Add time to date
 * @param {Date|string} date - Base date
 * @param {number} amount - Amount to add
 * @param {string} unit - Unit of time ('years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds')
 * @returns {Date} New date with added time
 */
const addTime = (date, amount, unit) => {
  const dateObj = new Date(date);

  if (Number.isNaN(dateObj.getTime())) {
    throw new Error("Invalid date provided");
  }

  switch (unit) {
    case "years":
      dateObj.setFullYear(dateObj.getFullYear() + amount);
      break;
    case "months":
      dateObj.setMonth(dateObj.getMonth() + amount);
      break;
    case "weeks":
      dateObj.setDate(dateObj.getDate() + amount * 7);
      break;
    case "days":
      dateObj.setDate(dateObj.getDate() + amount);
      break;
    case "hours":
      dateObj.setHours(dateObj.getHours() + amount);
      break;
    case "minutes":
      dateObj.setMinutes(dateObj.getMinutes() + amount);
      break;
    case "seconds":
      dateObj.setSeconds(dateObj.getSeconds() + amount);
      break;
    default:
      throw new Error(
        "Invalid time unit. Use: years, months, weeks, days, hours, minutes, seconds"
      );
  }

  return dateObj;
};

/**
 * Subtract time from date
 * @param {Date|string} date - Base date
 * @param {number} amount - Amount to subtract
 * @param {string} unit - Unit of time
 * @returns {Date} New date with subtracted time
 */
const subtractTime = (date, amount, unit) => addTime(date, -amount, unit);

/**
 * Get start of time period
 * @param {Date|string} date - Base date
 * @param {string} period - Time period ('year', 'month', 'week', 'day', 'hour', 'minute')
 * @returns {Date} Start of the specified time period
 */
const startOf = (date, period) => {
  const dateObj = new Date(date);

  if (Number.isNaN(dateObj.getTime())) {
    throw new Error("Invalid date provided");
  }

  switch (period) {
    case "year":
      return new Date(dateObj.getFullYear(), 0, 1);
    case "month":
      return new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
    case "week":
      const day = dateObj.getDay();
      const diff = dateObj.getDate() - day;
      return new Date(dateObj.setDate(diff));
    case "day":
      return new Date(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate()
      );
    case "hour":
      return new Date(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate(),
        dateObj.getHours()
      );
    case "minute":
      return new Date(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate(),
        dateObj.getHours(),
        dateObj.getMinutes()
      );
    default:
      throw new Error(
        "Invalid period. Use: year, month, week, day, hour, minute"
      );
  }
};

/**
 * Get end of time period
 * @param {Date|string} date - Base date
 * @param {string} period - Time period ('year', 'month', 'week', 'day', 'hour', 'minute')
 * @returns {Date} End of the specified time period
 */
const endOf = (date, period) => {
  const dateObj = new Date(date);

  if (Number.isNaN(dateObj.getTime())) {
    throw new Error("Invalid date provided");
  }

  switch (period) {
    case "year":
      return new Date(dateObj.getFullYear(), 11, 31, 23, 59, 59, 999);
    case "month":
      return new Date(
        dateObj.getFullYear(),
        dateObj.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
    case "week":
      const day = dateObj.getDay();
      const diff = dateObj.getDate() - day + 6;
      return new Date(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        diff,
        23,
        59,
        59,
        999
      );
    case "day":
      return new Date(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate(),
        23,
        59,
        59,
        999
      );
    case "hour":
      return new Date(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate(),
        dateObj.getHours(),
        59,
        59,
        999
      );
    case "minute":
      return new Date(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate(),
        dateObj.getHours(),
        dateObj.getMinutes(),
        59,
        999
      );
    default:
      throw new Error(
        "Invalid period. Use: year, month, week, day, hour, minute"
      );
  }
};

/**
 * Check if date is between two dates
 * @param {Date|string} date - Date to check
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @param {boolean} inclusive - Include boundary dates (default: true)
 * @returns {boolean} True if date is between start and end dates
 */
const isBetween = (date, startDate, endDate, inclusive = true) => {
  const dateObj = new Date(date);
  const startObj = new Date(startDate);
  const endObj = new Date(endDate);

  if (
    Number.isNaN(dateObj.getTime()) ||
    Number.isNaN(startObj.getTime()) ||
    Number.isNaN(endObj.getTime())
  ) {
    throw new Error("Invalid date provided");
  }

  if (inclusive) {
    return dateObj >= startObj && dateObj <= endObj;
  }
  return dateObj > startObj && dateObj < endObj;
};

/**
 * Check if two dates are the same day
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {boolean} True if dates are on the same day
 */
const isSameDay = (date1, date2) => {
  const date1Obj = new Date(date1);
  const date2Obj = new Date(date2);

  if (Number.isNaN(date1Obj.getTime()) || Number.isNaN(date2Obj.getTime())) {
    throw new Error("Invalid date provided");
  }

  return (
    date1Obj.getFullYear() === date2Obj.getFullYear() &&
    date1Obj.getMonth() === date2Obj.getMonth() &&
    date1Obj.getDate() === date2Obj.getDate()
  );
};

/**
 * Get difference between two dates
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @param {string} unit - Unit of measurement ('years', 'months', 'days', 'hours', 'minutes', 'seconds')
 * @returns {number} Difference in specified units
 */
const getDifference = (date1, date2, unit = "days") => {
  const date1Obj = new Date(date1);
  const date2Obj = new Date(date2);

  if (Number.isNaN(date1Obj.getTime()) || Number.isNaN(date2Obj.getTime())) {
    throw new Error("Invalid date provided");
  }

  const diffInMs = Math.abs(date2Obj - date1Obj);

  switch (unit) {
    case "years":
      return Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365));
    case "months":
      return Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30)); // Approximate
    case "days":
      return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    case "hours":
      return Math.floor(diffInMs / (1000 * 60 * 60));
    case "minutes":
      return Math.floor(diffInMs / (1000 * 60));
    case "seconds":
      return Math.floor(diffInMs / 1000);
    default:
      throw new Error(
        "Invalid unit. Use: years, months, days, hours, minutes, seconds"
      );
  }
};

/**
 * Check if date is in the past
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is in the past
 */
const isPast = (date) => {
  const dateObj = new Date(date);

  if (Number.isNaN(dateObj.getTime())) {
    throw new Error("Invalid date provided");
  }

  return dateObj < new Date();
};

/**
 * Check if date is in the future
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is in the future
 */
const isFuture = (date) => {
  const dateObj = new Date(date);

  if (Number.isNaN(dateObj.getTime())) {
    throw new Error("Invalid date provided");
  }

  return dateObj > new Date();
};

/**
 * Check if date is today
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is today
 */
const isToday = (date) => isSameDay(date, new Date());

/**
 * Get age from date of birth
 * @param {Date|string} dateOfBirth - Date of birth
 * @param {Date|string} referenceDate - Reference date for age calculation (default: today)
 * @returns {number} Age in years
 */
const getAge = (dateOfBirth, referenceDate = new Date()) => {
  const birthDate = new Date(dateOfBirth);
  const refDate = new Date(referenceDate);

  if (Number.isNaN(birthDate.getTime()) || Number.isNaN(refDate.getTime())) {
    throw new Error("Invalid date provided");
  }

  let age = refDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = refDate.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && refDate.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

module.exports = {
  formatDate,
  toISOString,
  formatDateInTimezone,
  getRelativeTime,
  addTime,
  subtractTime,
  startOf,
  endOf,
  isBetween,
  isSameDay,
  getDifference,
  isPast,
  isFuture,
  isToday,
  getAge,
};
