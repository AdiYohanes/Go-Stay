/**
 * NotificationBell component for header notification icon with unread count
 * Displays bell icon with animated badge and opens dropdown/sheet on click
 * Requirements: 10.4
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NotificationList } from "./NotificationList";
import { getUnreadCount } from "@/actions/notification";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface NotificationBellProps {
  className?: string;
}

export function NotificationBell({ className }: NotificationBellProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const fetchUnreadCount = useCallback(async () => {
    try {
      const result = await getUnreadCount();
      if (result.success) {
        setUnreadCount(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  const handleNotificationRead = useCallback(() => {
    // Refresh unread count when a notification is marked as read
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  const handleMarkAllRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  const bellButton = (
    <Button
      variant="ghost"
      size="icon"
      className={cn("relative", className)}
      aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
    >
      <Bell className="h-5 w-5" />
      {!isLoading && unreadCount > 0 && (
        <span
          className={cn(
            "absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-medium",
            "animate-in zoom-in-50 duration-200",
          )}
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Button>
  );

  // Use Sheet on mobile, Popover on desktop
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>{bellButton}</SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-md p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Notifications</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">
            <NotificationList
              onNotificationRead={handleNotificationRead}
              onMarkAllRead={handleMarkAllRead}
            />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{bellButton}</PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-80 p-0 max-h-[500px] overflow-hidden flex flex-col"
      >
        <div className="p-3 border-b font-semibold">Notifications</div>
        <div className="flex-1 overflow-y-auto max-h-[400px]">
          <NotificationList
            onNotificationRead={handleNotificationRead}
            onMarkAllRead={handleMarkAllRead}
            compact
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
