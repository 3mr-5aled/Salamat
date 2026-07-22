import api from "./api";

export const getDoctors = async (params?: { keyword?: string; specialty?: string }) => {
  const response = await api.get("/doctors", { params });
  return response.data.data || [];
};

export const getDoctorProfile = async (userId: string) => {
  const response = await api.get(`/doctors?user=${userId}`);
  if (response.data && response.data.data && response.data.data.length > 0) {
    return response.data.data[0];
  }
  return null;
};

export const updateDoctorProfile = async (profileId: string, profileData: any) => {
  const response = await api.patch(`/doctors/${profileId}`, profileData);
  return response.data.data;
};

export const getAllDoctorsAdmin = async (): Promise<any[]> => {
  const response = await api.get("/doctors");
  return response.data.data || response.data;
};

export const createDoctorAdmin = async (payload: any): Promise<any> => {
  const response = await api.post("/doctors", payload);
  return response.data;
};
