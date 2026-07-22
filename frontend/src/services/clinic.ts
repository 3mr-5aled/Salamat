import api from "./api";

export const getClinics = async (): Promise<any[]> => {
  const response = await api.get("/clinics");
  return response.data.data || response.data;
};

export const getClinicById = async (id: string): Promise<any> => {
  const response = await api.get(`/clinics/${id}`);
  return response.data.data || response.data;
};

export const createClinic = async (payload: any): Promise<any> => {
  const response = await api.post("/clinics", payload);
  return response.data.data || response.data;
};

export const updateClinic = async (id: string, payload: any): Promise<any> => {
  const response = await api.patch(`/clinics/${id}`, payload);
  return response.data.data || response.data;
};

export const deleteClinic = async (id: string): Promise<any> => {
  const response = await api.delete(`/clinics/${id}`);
  return response.data;
};

export const assignDoctorToClinic = async (clinicId: string, doctorId: string): Promise<any> => {
  const response = await api.post(`/clinics/${clinicId}/doctors`, { doctorId });
  return response.data;
};

export const removeDoctorFromClinic = async (clinicId: string, doctorId: string): Promise<any> => {
  const response = await api.delete(`/clinics/${clinicId}/doctors/${doctorId}`);
  return response.data;
};
