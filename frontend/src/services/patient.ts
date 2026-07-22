import api from "./api";

export const getPatientProfile = async (userId: string) => {
  const response = await api.get(`/patients?user=${userId}`);
  if (response.data && response.data.data && response.data.data.length > 0) {
    return response.data.data[0];
  }
  return null;
};

export const createPatientProfile = async (profileData: any) => {
  const response = await api.post("/patients", profileData);
  return response.data.data;
};

export const updatePatientProfile = async (profileId: string, profileData: any) => {
  const response = await api.patch(`/patients/${profileId}`, profileData);
  return response.data.data;
};

export const getUpcomingAppointments = async () => {
  const response = await api.get("/patients/appointments/upcoming");
  return response.data.data || [];
};

export const getAllPatientsAdmin = async (): Promise<any[]> => {
  const response = await api.get("/patients");
  return response.data.data || response.data;
};

export const updatePatientNotes = async (patientId: string, notes: string): Promise<any> => {
  const response = await api.patch(`/patients/${patientId}/notes`, { notes });
  return response.data;
};

export const createPatientAdmin = async (payload: any): Promise<any> => {
  const response = await api.post("/patients", payload);
  return response.data;
};

export const getPatientById = async (patientId: string): Promise<any> => {
  const response = await api.get(`/patients/${patientId}`);
  return response.data?.data || null;
};
