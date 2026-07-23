export const formatTimeInterval = (startTime: string, durationMin?: number): string => {
  if (!startTime) return "";
  if (!durationMin) return startTime;
  
  const [hours, minutes] = startTime.split(":").map(Number);
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);
  
  const endDate = new Date(startDate.getTime() + durationMin * 60 * 1000);
  const endHours = String(endDate.getHours()).padStart(2, "0");
  const endMinutes = String(endDate.getMinutes()).padStart(2, "0");
  
  return `${startTime} - ${endHours}:${endMinutes}`;
};

export const getAge = (dobString?: string): number | null => {
  if (!dobString) return null;
  try {
    const dob = new Date(dobString);
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  } catch {
    return null;
  }
};

export const getLocalDateString = (d = new Date()): string => {
  const offset = d.getTimezoneOffset();
  const localDate = new Date(d.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split("T")[0];
};
