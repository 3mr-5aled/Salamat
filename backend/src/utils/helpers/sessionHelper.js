/**
 * Converts HH:MM string to minutes since midnight
 * @param {string} timeStr - Time string (e.g. "09:30")
 * @returns {number} Minutes since midnight
 */
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

/**
 * Converts minutes since midnight to HH:MM format
 * @param {number} minutes - Minutes since midnight
 * @returns {string} Time string in HH:MM format
 */
const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

/**
 * Generates all slots for a session dynamically in memory.
 * @param {Object} session - The ClinicSession document
 * @returns {Array} List of computed slot objects
 */
exports.generateSessionSlots = (session) => {
  const slots = [];
  const startMinutes = timeToMinutes(session.startTime);
  const endMinutes = timeToMinutes(session.endTime);
  const duration = session.appointmentDuration;
  
  const capacity = Math.floor((endMinutes - startMinutes) / duration);
  
  for (let i = 0; i < capacity; i++) {
    const slotMinutes = startMinutes + i * duration;
    const timeStr = minutesToTime(slotMinutes);
    
    // Compute the exact Date representing the slot start time
    const appointmentTime = new Date(session.date);
    const [hours, mins] = timeStr.split(":").map(Number);
    appointmentTime.setHours(hours, mins, 0, 0);

    slots.push({
      slotIndex: i,
      time: timeStr,
      appointmentTime,
    });
  }
  return slots;
};
