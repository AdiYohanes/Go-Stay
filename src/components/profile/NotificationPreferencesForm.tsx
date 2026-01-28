"use client";

import { useState, useTransition } from "react";
import { updateNotificationPreferences } from "@/actions/profile";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface NotificationPreferencesFormProps {
  preferences: {
    email_booking_confirmation: boolean;
    email_booking_reminder: boolean;
    email_marketing: boolean;
    push_enabled: boolean;
  };
}

export function NotificationPreferencesForm({
  preferences,
}: NotificationPreferencesFormProps) {
  const [isPending, startTransition] = useTransition();
  const [prefs, setPrefs] = useState(preferences);

  const handleToggle = (key: keyof typeof prefs, value: boolean) => {
    const newPrefs = { ...prefs, [key]: value };
    setPrefs(newPrefs);

    // Auto-save on toggle
    startTransition(async () => {
      const result = await updateNotificationPreferences(newPrefs);

      if (result.success) {
        toast.success(result.data.message);
      } else {
        // Revert on error
        setPrefs(prefs);
        toast.error(result.error || "Failed to update preferences");
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="email_booking_confirmation">
            Booking Confirmations
          </Label>
          <p className="text-sm text-muted-foreground">
            Receive email when your booking is confirmed
          </p>
        </div>
        <Switch
          id="email_booking_confirmation"
          checked={prefs.email_booking_confirmation}
          onCheckedChange={(checked) =>
            handleToggle("email_booking_confirmation", checked)
          }
          disabled={isPending}
        />
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="email_booking_reminder">Booking Reminders</Label>
          <p className="text-sm text-muted-foreground">
            Get reminded about upcoming bookings
          </p>
        </div>
        <Switch
          id="email_booking_reminder"
          checked={prefs.email_booking_reminder}
          onCheckedChange={(checked) =>
            handleToggle("email_booking_reminder", checked)
          }
          disabled={isPending}
        />
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="email_marketing">Marketing Emails</Label>
          <p className="text-sm text-muted-foreground">
            Receive promotional offers and deals
          </p>
        </div>
        <Switch
          id="email_marketing"
          checked={prefs.email_marketing}
          onCheckedChange={(checked) =>
            handleToggle("email_marketing", checked)
          }
          disabled={isPending}
        />
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="push_enabled">Push Notifications</Label>
          <p className="text-sm text-muted-foreground">
            Enable browser push notifications
          </p>
        </div>
        <Switch
          id="push_enabled"
          checked={prefs.push_enabled}
          onCheckedChange={(checked) => handleToggle("push_enabled", checked)}
          disabled={isPending}
        />
      </div>
    </div>
  );
}
