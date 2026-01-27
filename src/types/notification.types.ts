/**
 * Notification type definitions for the hotel booking system
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5
 */

export type NotificationType =
  | "booking_confirmed"
  | "booking_cancelled"
  | "booking_reminder"
  | "payment_success"
  | "payment_failed"
  | "review_received"
  | "system";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, unknown>;
  read: boolean;
  created_at: string;
}

export interface CreateNotificationInput {
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

export interface NotificationPreferences {
  email_booking_confirmation: boolean;
  email_booking_reminder: boolean;
  email_marketing: boolean;
  push_enabled: boolean;
}

export interface NotificationCount {
  total: number;
  unread: number;
}
