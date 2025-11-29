import { api } from "./client";

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  level: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  is_read: boolean;
  category: string;
  link_url: string;
  created_at: string;
}

export async function fetchNotifications(params?: { unread?: boolean }) {
  const q = params?.unread ? "?unread=true" : "";
  const res = await api.get<NotificationItem[]>(`/api/notifications/${q}`);
  return res.data;
}

export async function fetchUnreadCount() {
  const res = await api.get<{ count: number }>(
    "/api/notifications/unread-count/"
  );
  return res.data.count;
}

export async function markAsRead(id: number) {
  await api.post(`/api/notifications/${id}/mark-read/`);
}

export async function markAllRead() {
  await api.post(`/api/notifications/mark-all-read/`);
}

export interface NotificationsPage {
  count: number;
  next: string | null;
  previous: string | null;
  results: NotificationItem[];
}

export async function fetchNotificationsPage(params: {
  limit?: number;
  offset?: number;
  unread?: boolean;
  is_read?: boolean;
  level?: string;
  category?: string;
  q?: string;
}) {
  const res = await api.get<NotificationsPage>(`/api/notifications/`, {
    params,
  });
  return res.data;
}
