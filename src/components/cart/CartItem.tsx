/**
 * CartItem component for displaying individual cart items
 * Shows property preview, dates, price, and availability status
 */

"use client";

import { CartItemWithDetails } from "@/types/cart.types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Calendar, Users } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

interface CartItemProps {
  item: CartItemWithDetails;
  onRemove: (itemId: string) => void;
}

export function CartItem({ item, onRemove }: CartItemProps) {
  const { property, pricing, isAvailable, check_in, check_out, guests } = item;

  const checkInDate = new Date(check_in);
  const checkOutDate = new Date(check_out);

  return (
    <Card className="p-4">
      <div className="flex gap-4">
        {/* Property Image */}
        <Link
          href={`/property/${property.id}`}
          className="relative w-32 h-24 shrink-0 rounded-md overflow-hidden"
        >
          <Image
            src={property.image_urls[0] || "/placeholder-property.jpg"}
            alt={property.title}
            fill
            className="object-cover hover:scale-105 transition-transform"
          />
        </Link>

        {/* Property Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <Link
                href={`/property/${property.id}`}
                className="font-semibold text-lg hover:underline line-clamp-1"
              >
                {property.title}
              </Link>
              <p className="text-sm text-muted-foreground">
                {property.location}
              </p>
            </div>

            {/* Remove Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(item.id)}
              className="shrink-0"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove from cart</span>
            </Button>
          </div>

          {/* Booking Details */}
          <div className="mt-3 space-y-2">
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {format(checkInDate, "MMM d")} -{" "}
                  {format(checkOutDate, "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>
                  {guests} {guests === 1 ? "guest" : "guests"}
                </span>
              </div>
              <div className="text-muted-foreground">
                {pricing.nights} {pricing.nights === 1 ? "night" : "nights"}
              </div>
            </div>

            {/* Availability Status */}
            <div>
              {isAvailable ? (
                <Badge
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Available
                </Badge>
              ) : (
                <Badge variant="destructive">Not Available</Badge>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-sm text-muted-foreground">
              ${pricing.nightly_rate} × {pricing.nights} nights
            </div>
            <div className="font-semibold text-lg">
              ${pricing.total.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
