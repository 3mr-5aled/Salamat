import api from "./api";

export interface NotificationItem {
  _id: string;
  recipient: string;
  title: string;
  message: string;
  type: "appointment_booked" | "appointment_approved" | "appointment_rejected" | "system";
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface NotificationsResponse {
  status: string;
  unreadCount: number;
  results: number;
  data: NotificationItem[];
}

export const getMyNotifications = async (): Promise<NotificationsResponse> => {
  const response = await api.get("/notifications");
  return response.data;
};

export const markNotificationAsRead = async (id: string): Promise<NotificationItem> => {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data?.data;
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await api.patch("/notifications/read-all");
};
