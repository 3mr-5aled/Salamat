import api from "./api";

/**
 * Represents a single item in a doctor's prescription list.
 */
export interface PrescriptionItem {
  /**
   * Medication name
   */
  m: string;
  /**
   * Dosage instructions
   */
  d?: string;
  /**
   * Frequency instructions
   */
  f?: string;
  /**
   * Duration instructions
   */
  t?: string;
}

/**
 * Filter criteria for querying appointments.
 */
export interface AppointmentFilters {
  /**
   * Filter appointments by doctor profile ID
   */
  doctor?: string;
  /**
   * Filter appointments by patient profile ID
   */
  patient?: string;
  /**
   * Filter appointments by status (e.g. 'Scheduled', 'Pending-Approval', 'Completed', 'Cancelled')
   */
  status?: string;
  /**
   * Filter appointments by date (ISO date string)
   */
  date?: string;
  /**
   * Allow dynamic query parameters
   */
  [key: string]: unknown;
}

/**
 * Input details for creating a new appointment slot.
 */
export interface CreateSlotInput {
  /**
   * Doctor profile ID
   */
  doctor?: string;
  /**
   * Clinic ID
   */
  clinic?: string;
  /**
   * Slot date (e.g., "YYYY-MM-DD")
   */
  date?: string;
  /**
   * Start time (e.g., "HH:MM")
   */
  time?: string;
  /**
   * Duration in minutes
   */
  duration?: number;
  /**
   * Maximum number of patients allowed for this slot
   */
  MaxNumberOfPatients?: number;
  /**
   * Slot type (e.g., "Online", "In-Person")
   */
  type?: string;
  /**
   * Optional notes or description
   */
  notes?: string;
  /**
   * Allow dynamic fields
   */
  [key: string]: unknown;
}

/**
 * Represents an appointment slot structure returned by the API.
 */
export interface AppointmentSlot {
  /**
   * Unique identifier of the slot
   */
  _id: string;
  /**
   * Doctor profile ID or populated doctor object
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doctor?: any;
  /**
   * Clinic ID
   */
  clinic?: string;
  /**
   * Date of appointment
   */
  date?: string;
  /**
   * Time of appointment
   */
  time?: string;
  /**
   * Duration in minutes
   */
  duration?: number;
  /**
   * Current status of the appointment
   */
  status?: string;
  /**
   * Patient registrations for this slot
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  patient?: any;
  /**
   * Symptoms reported by the patient
   */
  symptoms?: string;
  /**
   * Notes, clinical records or serialized prescription data
   */
  notes?: string;
  /**
   * Maximum number of patients allowed
   */
  MaxNumberOfPatients?: number;
  /**
   * Slot type
   */
  type?: string;
  /**
   * Allow dynamic fields in case backend returns extra properties
   */
  [key: string]: unknown;
}

/**
 * Fetch available/scheduled slots for a specific doctor.
 * 
 * @param doctorId - The unique identifier of the doctor.
 * @returns A promise that resolves to an array of appointment slots.
 */
export const getDoctorSlots = async (doctorId: string): Promise<AppointmentSlot[]> => {
  const response = await api.get(`/appointments?doctor=${doctorId}&status=Scheduled`);
  return response.data?.data || [];
};

/**
 * Register a patient for an appointment slot.
 * 
 * @param appointmentId - The ID of the appointment slot.
 * @param patientId - The ID of the patient registering.
 * @param symptoms - Optional symptoms details.
 * @returns A promise that resolves to the API response object.
 */
export const registerForAppointment = async (
  appointmentId: string,
  patientId: string,
  symptoms?: string
): Promise<unknown> => {
  const response = await api.post(`/appointments/${appointmentId}/register`, {
    patientId,
    symptoms,
  });
  return response.data;
};

/**
 * Cancel a patient's pending/approved registration for an appointment.
 * 
 * @param appointmentId - The ID of the appointment slot.
 * @returns A promise that resolves to the API response object.
 */
export const cancelAppointmentRegistration = async (appointmentId: string): Promise<unknown> => {
  const response = await api.delete(`/appointments/${appointmentId}/cancel-my-registration`);
  return response.data;
};

/**
 * Fetch appointments matching optional filter parameters.
 * 
 * @param params - Optional filter parameters.
 * @returns A promise that resolves to an array of appointment slots.
 */
export const getAppointments = async (params?: AppointmentFilters): Promise<AppointmentSlot[]> => {
  const response = await api.get("/appointments", { params });
  return response.data?.data || [];
};

/**
 * Create a new appointment slot.
 * 
 * @param slotData - Details of the slot to create.
 * @returns A promise that resolves to the newly created appointment slot.
 */
export const createAppointmentSlot = async (slotData: CreateSlotInput): Promise<AppointmentSlot> => {
  const response = await api.post("/appointments", slotData);
  return response.data?.data;
};

/**
 * Delete an existing vacant appointment slot.
 * 
 * @param slotId - The ID of the appointment slot to delete.
 * @returns A promise that resolves to the API response object.
 */
export const deleteAppointmentSlot = async (slotId: string): Promise<unknown> => {
  const response = await api.delete(`/appointments/${slotId}`);
  return response.data;
};

/**
 * Approve a patient's registration request for a slot.
 * 
 * @param slotId - The ID of the appointment slot.
 * @param patientId - The ID of the patient.
 * @returns A promise that resolves to the updated appointment slot.
 */
export const approvePatientRegistration = async (
  slotId: string,
  patientId: string
): Promise<AppointmentSlot> => {
  const response = await api.patch(`/appointments/${slotId}/approve-registration`, { patientId });
  return response.data?.data;
};

/**
 * Fetch all pending appointment registrations for administrative approval.
 */
export const getPendingAppointments = async (): Promise<AppointmentSlot[]> => {
  const response = await api.get("/appointments/pending");
  return response.data?.data || [];
};

/**
 * Approve a pending appointment registration.
 */
export const approveAppointment = async (appointmentId: string): Promise<AppointmentSlot> => {
  const response = await api.patch(`/appointments/${appointmentId}/approve`);
  return response.data?.data;
};

/**
 * Reject a pending appointment registration.
 */
export const rejectAppointment = async (
  appointmentId: string,
  reason?: string
): Promise<AppointmentSlot> => {
  const response = await api.patch(`/appointments/${appointmentId}/reject`, { reason });
  return response.data?.data;
};

/**
 * Reject a patient's registration request for a slot.
 * 
 * @param slotId - The ID of the appointment slot.
 * @param patientId - The ID of the patient.
 * @param rejectionReason - Optional explanation for rejection.
 * @returns A promise that resolves to the updated appointment slot.
 */
export const rejectPatientRegistration = async (
  slotId: string,
  patientId: string,
  rejectionReason?: string
): Promise<AppointmentSlot> => {
  const response = await api.patch(`/appointments/${slotId}/reject-registration`, {
    patientId,
    rejectionReason,
  });
  return response.data?.data;
};

/**
 * Complete a consultation, serializing diagnosis and prescription items safely into notes.
 * 
 * @param slotId - The ID of the appointment slot.
 * @param diagnosis - Doctor's diagnosis.
 * @param prescriptions - List of prescribed items.
 * @returns A promise that resolves to the updated appointment slot.
 */
export const completeConsultation = async (
  slotId: string,
  diagnosis: string,
  prescriptions: PrescriptionItem[]
): Promise<AppointmentSlot> => {
  let serializedNotes: string;
  try {
    const records = {
      dx: diagnosis || "",
      rx: Array.isArray(prescriptions) ? prescriptions : [],
    };
    serializedNotes = JSON.stringify(records);
  } catch (error) {
    console.error("Failed to safely serialize clinical records, falling back:", error);
    // Safe fallback serialization using only primitive fields
    serializedNotes = JSON.stringify({
      dx: String(diagnosis || ""),
      rx: [],
    });
  }

  const response = await api.patch(`/appointments/${slotId}/status`, {
    status: "Completed",
    notes: serializedNotes,
  });
  return response.data?.data;
};

/**
 * Fetch all appointments for a specific patient (Admin use).
 * 
 * @param patientId - The patient profile ID.
 * @returns A promise resolving to an array of appointment slots.
 */
export const getPatientAppointments = async (patientId: string): Promise<AppointmentSlot[]> => {
  const response = await api.get("/appointments", {
    params: { "patient.patientId": patientId },
  });
  return response.data?.data || [];
};

/**
 * Update an existing appointment slot.
 * 
 * @param slotId - The ID of the slot to update.
 * @param slotData - The updated slot fields.
 * @returns A promise resolving to the updated appointment slot.
 */
export const updateAppointmentSlot = async (
  slotId: string,
  slotData: Partial<CreateSlotInput>
): Promise<AppointmentSlot> => {
  const response = await api.patch(`/appointments/${slotId}`, slotData);
  return response.data?.data;
};

/**
 * Soft cancel a session and all its non-completed registrations.
 * 
 * @param slotId - The ID of the session slot.
 * @returns A promise resolving to the API response object.
 */
export const cancelClinicSession = async (slotId: string): Promise<unknown> => {
  const response = await api.patch(`/appointments/${slotId}/cancel-session`);
  return response.data;
};

/**
 * Cancel sessions for a doctor on a given date.
 * - Today -> cancels only sessions whose startTime > now
 * - Future date -> cancels all sessions on that date
 * 
 * @param doctorId - The Doctor profile ID
 * @param date - ISO date string YYYY-MM-DD
 */
export const cancelSessionsOnDate = async (
  doctorId: string,
  date: string,
  reason?: string,
  range?: string
): Promise<{ cancelledSessions: number; cancelledAppointments: number }> => {
  const response = await api.patch("/appointments/cancel-sessions-on-date", {
    doctorId,
    date,
    reason,
    range,
  });
  return response.data?.data;
};

