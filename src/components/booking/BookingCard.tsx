/**
 * BookingCard component - Display booking summary with actions
 * Requirements: 2.5, 2.6
 * Shows booking details, status, and cancellation option
 */

"use client";

import { useState } from "react";
import { BookingWithDetails } from "@/types/booking.types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { CalendarIcon, MapPinIcon, UsersIcon, XCircleIcon } from "lucide-react";
import { cancelBooking } from "@/actions/bookings";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface BookingCardProps {
  booking: BookingWithDetails;
  onCancelled?: () => void;
  showCancelButton?: boolean;
}

/**
 * Card component displaying booking summary with property image, dates, guests, and status
 * Includes cancel button with confirmation modal
 */
export function BookingCard({
  booking,
  onCancelled,
  showCancelButton = true,
}: BookingCardProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    setIsCancelling(true);

    try {
      const result = await cancelBooking(booking.id);

      if (result.success) {
        toast.success("Booking cancelled successfully");
        setIsDialogOpen(false);

        if (onCancelled) {
          onCancelled();
        } else {
          router.refresh();
        }
      } else {
        toast.error(result.error || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusBadge = () => {
    const statusConfig = {
      pending: { variant: "outline" as const, label: "Pending" },
      confirmed: { variant: "default" as const, label: "Confirmed" },
      cancelled: { variant: "destructive" as const, label: "Cancelled" },
      completed: { variant: "secondary" as const, label: "Completed" },
    };

    const config = statusConfig[booking.status] || statusConfig.pending;

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const canCancel =
    booking.status === "confirmed" || booking.status === "pending";
  const propertyImage =
    booking.property.image_urls?.[0] || "/placeholder-property.jpg";

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Property image */}
          <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0">
            <img
              src={propertyImage}
              alt={booking.property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2">{getStatusBadge()}</div>
          </div>

          {/* Booking details */}
          <div className="flex-1 p-4 sm:p-6">
            <div className="space-y-4">
              {/* Property title and location */}
              <div>
                <h3 className="text-lg font-semibold mb-1">
                  {booking.property.title}
                </h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPinIcon className="h-3 w-3" />
                  <span>{booking.property.location}</span>
                </div>
              </div>

              {/* Dates and guests */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Check-in</p>
                    <p className="text-muted-foreground">
                      {format(new Date(booking.start_date), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Check-out</p>
                    <p className="text-muted-foreground">
                      {format(new Date(booking.end_date), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
                <span>
                  {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
                </span>
              </div>

              {/* Price and payment status */}
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total price</p>
                    <p className="text-xl font-bold">
                      ${booking.total_price.toFixed(2)}
                    </p>
                  </div>

                  {/* Cancel button */}
                  {showCancelButton && canCancel && (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <XCircleIcon className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Cancel Booking</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to cancel this booking? This
                            action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <div className="space-y-2 text-sm">
                            <p>
                              <span className="font-medium">Property:</span>{" "}
                              {booking.property.title}
                            </p>
                            <p>
                              <span className="font-medium">Dates:</span>{" "}
                              {format(new Date(booking.start_date), "MMM d")} -{" "}
                              {format(
                                new Date(booking.end_date),
                                "MMM d, yyyy",
                              )}
                            </p>
                            <p>
                              <span className="font-medium">Total:</span> $
                              {booking.total_price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            disabled={isCancelling}
                          >
                            Keep Booking
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleCancel}
                            disabled={isCancelling}
                          >
                            {isCancelling ? "Cancelling..." : "Cancel Booking"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>

              {/* Special requests if any */}
              {booking.special_requests && (
                <div className="pt-3 border-t">
                  <p className="text-sm font-medium mb-1">Special Requests</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.special_requests}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
