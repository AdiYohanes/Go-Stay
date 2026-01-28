/**
 * NotificationList component for displaying notifications
 * Shows notifications with timestamps, read/unread distinction, and mark as read functionality
 * Implements staggered entrance animations
 * Requirements: 10.4, 10.5, 7.1
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  Calendar,
  CheckCircle,
  XCircle,
  CreditCard,
  AlertCircle,
  CheckCheck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
} from "@/actions/notification";
import { Notification, NotificationType } from "@/types/notification.types";
import { cn } from "@/lib/utils";

interface NotificationListProps {
  onNotificationRead?: () => void;
  onMarkAllRead?: () => void;
  compact?: boolean;
}

const notificationIcons: Record<NotificationType, React.ReactNode> = {
  booking_confirmed: <CheckCircle className="h-5 w-5 text-green-500" />,
  booking_cancelled: <XCircle className="h-5 w-5 text-red-500" />,
  booking_reminder: <Calendar className="h-5 w-5 text-blue-500" />,
  payment_success: <CreditCard className="h-5 w-5 text-green-500" />,
  payment_failed: <CreditCard className="h-5 w-5 text-red-500" />,
  review_received: <Bell className="h-5 w-5 text-yellow-500" />,
  system: <AlertCircle className="h-5 w-5 text-muted-foreground" />,
};

export function NotificationList({
  onNotificationRead,
  onMarkAllRead,
  compact = false,
}: NotificationListProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);
  const [markingReadIds, setMarkingReadIds] = useState<Set<string>>(new Set());
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchNotifications = useCallback(async (pageNum: number = 1) => {
    try {
      const result = await getUserNotifications(pageNum, 10);
      if (result.success) {
        if (pageNum === 1) {
          setNotifications(result.data.notifications);
        } else {
          setNotifications((prev) => [...prev, ...result.data.notifications]);
        }
        setHasMore(result.data.hasMore);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = useCallback(
    async (notificationId: string) => {
      setMarkingReadIds((prev) => new Set(prev).add(notificationId));
      try {
        const result = await markAsRead(notificationId);
        if (result.success) {
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === notificationId ? { ...n, read: true } : n,
            ),
          );
          onNotificationRead?.();
        }
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      } finally {
        setMarkingReadIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(notificationId);
          return newSet;
        });
      }
    },
    [onNotificationRead],
  );

  const handleMarkAllAsRead = useCallback(async () => {
    setIsMarkingAllRead(true);
    try {
      const result = await markAllAsRead();
      if (result.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        onMarkAllRead?.();
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    } finally {
      setIsMarkingAllRead(false);
    }
  }, [onMarkAllRead]);

  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNotifications(nextPage);
    }
  }, [isLoadingMore, hasMore, page, fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p className="font-medium">No notifications yet</p>
        <p className="text-sm mt-1">
          We&apos;ll notify you when something important happens
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Mark all as read button */}
      {unreadCount > 0 && (
        <div className="p-2 border-b flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAllRead}
            className="text-xs"
          >
            {isMarkingAllRead ? (
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            ) : (
              <CheckCheck className="h-3 w-3 mr-1" />
            )}
            Mark all as read
          </Button>
        </div>
      )}

      {/* Notification items with staggered animation */}
      <div className="divide-y">
        {notifications.map((notification, index) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkAsRead={handleMarkAsRead}
            isMarkingRead={markingReadIds.has(notification.id)}
            compact={compact}
            animationDelay={index * 50}
          />
        ))}
      </div>

      {/* Load more button */}
      {hasMore && (
        <div className="p-3 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="w-full"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Load more"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  isMarkingRead: boolean;
  compact?: boolean;
  animationDelay?: number;
}

function NotificationItem({
  notification,
  onMarkAsRead,
  isMarkingRead,
  compact = false,
  animationDelay = 0,
}: NotificationItemProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), animationDelay);
    return () => clearTimeout(timer);
  }, [animationDelay]);

  const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
  });

  const icon = notificationIcons[notification.type] || (
    <Bell className="h-5 w-5 text-muted-foreground" />
  );

  return (
    <div
      className={cn(
        "flex gap-3 p-3 transition-all duration-300 cursor-pointer hover:bg-accent/50",
        !notification.read && "bg-accent/30",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        compact ? "p-2" : "p-3",
      )}
      onClick={() => !notification.read && onMarkAsRead(notification.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!notification.read) {
            onMarkAsRead(notification.id);
          }
        }
      }}
      aria-label={`${notification.title}. ${notification.message}. ${notification.read ? "Read" : "Unread"}`}
    >
      {/* Icon */}
      <div
        className={cn(
          "shrink-0 rounded-full bg-muted flex items-center justify-center",
          compact ? "h-8 w-8" : "h-10 w-10",
        )}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "font-medium truncate",
              compact ? "text-sm" : "text-base",
              !notification.read && "text-foreground",
              notification.read && "text-muted-foreground",
            )}
          >
            {notification.title}
          </p>
          {!notification.read && (
            <span className="shrink-0 h-2 w-2 rounded-full bg-primary mt-1.5" />
          )}
        </div>
        <p
          className={cn(
            "text-muted-foreground line-clamp-2",
            compact ? "text-xs" : "text-sm",
          )}
        >
          {notification.message}
        </p>
        <p
          className={cn(
            "text-muted-foreground mt-1",
            compact ? "text-[10px]" : "text-xs",
          )}
        >
          {timeAgo}
        </p>
      </div>

      {/* Loading indicator when marking as read */}
      {isMarkingRead && (
        <div className="shrink-0 self-center">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
