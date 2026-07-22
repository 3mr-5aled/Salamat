import api from "./api";

export interface AnalyticsData {
  clinicsCount: number;
  doctorsCount: number;
}

export const getAnalytics = async (): Promise<AnalyticsData> => {
  const response = await api.get("/analytics");
  return response.data.data;
};
