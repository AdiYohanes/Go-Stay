/**
 * BookingConfirmation component - Success animation and booking summary
 * Requirements: 2.4, 7.6
 * Displays success animation with Framer Motion and booking details
 */

"use client";

import { useEffect, useState } from "react";
import { BookingWithDetails } from "@/types/booking.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import {
  CheckCircle2,
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  ArrowRightIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface BookingConfirmationProps {
  booking: BookingWithDetails;
  onViewBookings?: () => void;
}

/**
 * Confirmation component with success animation and booking details summary
 * Provides navigation to bookings page
 */
export function BookingConfirmation({
  booking,
  onViewBookings,
}: BookingConfirmationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Trigger animation after mount with a small delay to ensure proper animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const handleViewBookings = () => {
    if (onViewBookings) {
      onViewBookings();
    } else {
      router.push("/my-bookings");
    }
  };

  const propertyImage =
    booking.property.image_urls?.[0] || "/placeholder-property.jpg";

  return (
    <div className="min-h-[600px] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-2xl"
      >
        <div className="text-center space-y-6">
          {/* Success icon with animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: isVisible ? 1 : 0 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            className="flex justify-center"
          >
            <div className="relative">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: isVisible ? 1 : 0,
                  opacity: isVisible ? 0.2 : 0,
                }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="absolute inset-0 bg-green-500 rounded-full blur-2xl"
              />
              <div className="relative bg-green-100 dark:bg-green-900/30 rounded-full p-6">
                <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </motion.div>

          {/* Success message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-2"
          >
            <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
            <p className="text-muted-foreground text-lg">
              Your reservation has been successfully confirmed
            </p>
          </motion.div>

          {/* Booking details card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Card className="text-left">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  {/* Property image */}
                  <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0">
                    <img
                      src={propertyImage}
                      alt={booking.property.title}
                      className="w-full h-full object-cover rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none"
                    />
                  </div>

                  {/* Booking details */}
                  <div className="flex-1 p-6">
                    <div className="space-y-4">
                      {/* Property title and location */}
                      <div>
                        <h3 className="text-xl font-semibold mb-1">
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
                              {format(
                                new Date(booking.start_date),
                                "EEEE, MMM d, yyyy",
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div className="text-sm">
                            <p className="font-medium">Check-out</p>
                            <p className="text-muted-foreground">
                              {format(
                                new Date(booking.end_date),
                                "EEEE, MMM d, yyyy",
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <UsersIcon className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {booking.guests}{" "}
                          {booking.guests === 1 ? "guest" : "guests"}
                        </span>
                      </div>

                      {/* Price breakdown */}
                      <div className="pt-3 border-t space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Subtotal
                          </span>
                          <span>
                            $
                            {(
                              booking.total_price - booking.service_fee
                            ).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Service fee
                          </span>
                          <span>${booking.service_fee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold pt-2 border-t">
                          <span>Total</span>
                          <span className="text-lg">
                            ${booking.total_price.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Booking reference */}
                      <div className="pt-3 border-t">
                        <p className="text-xs text-muted-foreground">
                          Booking reference:{" "}
                          <span className="font-mono">
                            {booking.id.slice(0, 8).toUpperCase()}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button size="lg" onClick={handleViewBookings} className="gap-2">
              View My Bookings
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/")}
            >
              Back to Home
            </Button>
          </motion.div>

          {/* Additional info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-sm text-muted-foreground"
          >
            <p>
              A confirmation email has been sent to your registered email
              address.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
