import api from "./api";

export interface AdminMessageItem {
  _id: string;
  senderName: string;
  senderEmail: string;
  senderRole: "doctor" | "patient";
  senderId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getAdminMessages = async (): Promise<AdminMessageItem[]> => {
  const response = await api.get("/auth/admin-messages");
  if (response.data && response.data.status === "success") {
    return response.data.data || [];
  }
  return [];
};

export const markAdminMessageAsRead = async (id: string): Promise<AdminMessageItem> => {
  const response = await api.patch(`/auth/admin-messages/${id}/read`);
  return response.data.data;
};

export const markAllAdminMessagesAsRead = async (): Promise<void> => {
  await api.patch("/auth/admin-messages/read-all");
};
