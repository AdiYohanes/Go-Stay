/**
 * BookingWidget component - Reusable reservation form
 * Requirements: 2.1, 2.2, 2.3, 7.6, 8.6
 * Responsive layout: sidebar on desktop, sticky footer on mobile
 */

"use client";

import { useState, useEffect } from "react";
import { Property } from "@/types/property.types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AvailabilityIndicator } from "./AvailabilityIndicator";
import { calculateBookingPrice } from "@/lib/price-calculator";
import { BookingPriceCalculation } from "@/types/booking.types";
import { format } from "date-fns";
import { CalendarIcon, MinusIcon, PlusIcon, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { showAddedToCart, showValidationError } from "@/lib/toast-utils";
import { motion, AnimatePresence } from "framer-motion";

interface BookingWidgetProps {
  property: Property;
  onBookingComplete?: () => void;
  className?: string;
}

/**
 * Reusable booking widget with date picker, guest selector, and price breakdown
 * Adds reservation to cart instead of direct booking
 */
export function BookingWidget({
  property,
  onBookingComplete,
  className = "",
}: BookingWidgetProps) {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [guests, setGuests] = useState(1);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [pricing, setPricing] = useState<BookingPriceCalculation | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const { addToCart: addItem } = useCart();

  // Calculate pricing when dates change
  useEffect(() => {
    if (startDate && endDate && endDate > startDate) {
      const calculation = calculateBookingPrice(
        property.price_per_night,
        startDate,
        endDate,
      );
      setPricing(calculation);
    } else {
      setPricing(null);
    }
  }, [startDate, endDate, property.price_per_night]);

  const handleDateSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (range?.from) {
      setStartDate(range.from);
      setEndDate(range.to);
    }
  };

  const incrementGuests = () => {
    if (guests < property.max_guests) {
      setGuests(guests + 1);
    }
  };

  const decrementGuests = () => {
    if (guests > 1) {
      setGuests(guests - 1);
    }
  };

  const handleReserve = async () => {
    if (!startDate || !endDate) {
      showValidationError("Please select check-in and check-out dates");
      return;
    }

    if (endDate <= startDate) {
      showValidationError("Check-out date must be after check-in date");
      return;
    }

    if (guests > property.max_guests) {
      showValidationError(
        `This property can accommodate a maximum of ${property.max_guests} guests`,
      );
      return;
    }

    setIsAdding(true);

    try {
      await addItem({
        property_id: property.id,
        check_in: startDate,
        check_out: endDate,
        guests,
      });

      showAddedToCart(property.title);

      if (onBookingComplete) {
        onBookingComplete();
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      // Error toast is handled by useCart hook
    } finally {
      setIsAdding(false);
    }
  };

  const isReserveDisabled =
    !startDate || !endDate || endDate <= startDate || isAdding;

  return (
    <div className={cn("w-full", className)}>
      {/* Desktop: Sidebar layout */}
      <div className="hidden lg:block">
        <div className="border rounded-lg p-6 shadow-lg sticky top-24">
          <div className="space-y-6">
            {/* Price header */}
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">
                ${property.price_per_night}
              </span>
              <span className="text-muted-foreground">/ night</span>
            </div>

            {/* Date picker */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Dates</label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate && endDate ? (
                      <>
                        {format(startDate, "MMM d")} -{" "}
                        {format(endDate, "MMM d, yyyy")}
                      </>
                    ) : (
                      <span>Select dates</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={{ from: startDate, to: endDate }}
                    onSelect={handleDateSelect}
                    numberOfMonths={2}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Guest selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Guests</label>
              <div className="flex items-center justify-between border rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {guests} {guests === 1 ? "guest" : "guests"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={decrementGuests}
                    disabled={guests <= 1}
                  >
                    <MinusIcon className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={incrementGuests}
                    disabled={guests >= property.max_guests}
                  >
                    <PlusIcon className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Maximum {property.max_guests} guests
              </p>
            </div>

            {/* Availability indicator */}
            {startDate && endDate && (
              <AvailabilityIndicator
                propertyId={property.id}
                startDate={startDate}
                endDate={endDate}
                showConflictingDates={true}
              />
            )}

            {/* Reserve button */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleReserve}
              disabled={isReserveDisabled}
            >
              {isAdding ? "Adding to cart..." : "Reserve"}
            </Button>

            {/* Price breakdown with animation */}
            <AnimatePresence mode="wait">
              {pricing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3 pt-4 border-t"
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      ${property.price_per_night} × {pricing.nights}{" "}
                      {pricing.nights === 1 ? "night" : "nights"}
                    </span>
                    <span>${pricing.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service fee</span>
                    <span>${pricing.service_fee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-3 border-t">
                    <span>Total</span>
                    <span>${pricing.total.toFixed(2)}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile: Sticky footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50">
        <div className="p-4 space-y-3">
          {/* Compact date and guest selector */}
          <div className="grid grid-cols-2 gap-2">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  {startDate && endDate ? (
                    <span className="text-xs truncate">
                      {format(startDate, "MMM d")} - {format(endDate, "MMM d")}
                    </span>
                  ) : (
                    <span className="text-xs">Dates</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="range"
                  selected={{ from: startDate, to: endDate }}
                  onSelect={handleDateSelect}
                  numberOfMonths={1}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <div className="flex items-center justify-between border rounded-lg px-2">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={decrementGuests}
                disabled={guests <= 1}
              >
                <MinusIcon className="h-3 w-3" />
              </Button>
              <span className="text-xs font-medium">
                {guests} {guests === 1 ? "guest" : "guests"}
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={incrementGuests}
                disabled={guests >= property.max_guests}
              >
                <PlusIcon className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Availability indicator (compact) */}
          {startDate && endDate && (
            <AvailabilityIndicator
              propertyId={property.id}
              startDate={startDate}
              endDate={endDate}
              variant="compact"
              showConflictingDates={false}
            />
          )}

          {/* Price and reserve button */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold">
                  ${property.price_per_night}
                </span>
                <span className="text-xs text-muted-foreground">/ night</span>
              </div>
              {pricing && (
                <span className="text-xs text-muted-foreground">
                  Total: ${pricing.total.toFixed(2)}
                </span>
              )}
            </div>
            <Button
              size="lg"
              onClick={handleReserve}
              disabled={isReserveDisabled}
              className="flex-1"
            >
              {isAdding ? "Adding..." : "Reserve"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
