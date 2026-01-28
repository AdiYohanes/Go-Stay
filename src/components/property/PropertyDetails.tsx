"use client";

import { Property } from "@/types/property.types";
import { AvailabilityIndicator } from "@/components/booking/AvailabilityIndicator";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Wifi,
  Utensils,
  Tv,
  Wind,
  Waves,
  Car,
  Dumbbell,
  Coffee,
  PawPrint,
  Cigarette,
  Users,
  Bed,
  Bath,
  Home,
  MapPin,
  Star,
} from "lucide-react";

/**
 * PropertyDetails component for displaying comprehensive property information
 * Requirements: 1.6
 *
 * Features:
 * - Display all property information with sections
 * - Show amenities with icons
 * - Display host information
 * - Include AvailabilityIndicator for selected dates
 */

interface PropertyDetailsProps {
  property: Property;
  checkIn?: Date | null;
  checkOut?: Date | null;
  className?: string;
}

// Map amenities to icons
const amenityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="h-5 w-5" />,
  Kitchen: <Utensils className="h-5 w-5" />,
  TV: <Tv className="h-5 w-5" />,
  "Air conditioning": <Wind className="h-5 w-5" />,
  Heating: <Wind className="h-5 w-5" />,
  Pool: <Waves className="h-5 w-5" />,
  "Hot tub": <Waves className="h-5 w-5" />,
  "Free parking": <Car className="h-5 w-5" />,
  Gym: <Dumbbell className="h-5 w-5" />,
  Breakfast: <Coffee className="h-5 w-5" />,
  "Pets allowed": <PawPrint className="h-5 w-5" />,
  "Smoking allowed": <Cigarette className="h-5 w-5" />,
  Workspace: <Home className="h-5 w-5" />,
};

const getAmenityIcon = (amenity: string) => {
  return amenityIcons[amenity] || <Badge className="h-5 w-5" />;
};

export function PropertyDetails({
  property,
  checkIn = null,
  checkOut = null,
  className = "",
}: PropertyDetailsProps) {
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Property Overview */}
      <section>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{property.location}</span>
              </div>
              {property.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="font-medium text-foreground">
                    {property.rating.toFixed(1)}
                  </span>
                  {property.review_count > 0 && (
                    <span>({property.review_count} reviews)</span>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              ${property.price_per_night}
            </div>
            <div className="text-sm text-muted-foreground">per night</div>
          </div>
        </div>

        {/* Availability Indicator */}
        {checkIn && checkOut && (
          <AvailabilityIndicator
            propertyId={property.id}
            startDate={checkIn}
            endDate={checkOut}
            showConflictingDates={true}
            className="mb-4"
          />
        )}
      </section>

      <Separator />

      {/* Property Stats */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Property Details</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
            <Users className="h-6 w-6 text-muted-foreground" />
            <div>
              <div className="font-semibold">{property.max_guests}</div>
              <div className="text-sm text-muted-foreground">Guests</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
            <Home className="h-6 w-6 text-muted-foreground" />
            <div>
              <div className="font-semibold">{property.bedrooms}</div>
              <div className="text-sm text-muted-foreground">Bedrooms</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
            <Bed className="h-6 w-6 text-muted-foreground" />
            <div>
              <div className="font-semibold">{property.beds}</div>
              <div className="text-sm text-muted-foreground">Beds</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
            <Bath className="h-6 w-6 text-muted-foreground" />
            <div>
              <div className="font-semibold">{property.bathrooms}</div>
              <div className="text-sm text-muted-foreground">Bathrooms</div>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Description */}
      {property.description && (
        <>
          <section>
            <h2 className="text-xl font-semibold mb-4">About this place</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </section>
          <Separator />
        </>
      )}

      {/* Amenities */}
      {property.amenities && property.amenities.length > 0 && (
        <>
          <section>
            <h2 className="text-xl font-semibold mb-4">
              What this place offers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                >
                  <div className="text-muted-foreground">
                    {getAmenityIcon(amenity)}
                  </div>
                  <span className="font-medium">{amenity}</span>
                </div>
              ))}
            </div>
          </section>
          <Separator />
        </>
      )}

      {/* Location */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Location</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <div className="font-medium">{property.location}</div>
              {property.latitude && property.longitude && (
                <div className="text-sm text-muted-foreground">
                  Coordinates: {property.latitude.toFixed(6)},{" "}
                  {property.longitude.toFixed(6)}
                </div>
              )}
            </div>
          </div>

          {/* Placeholder for map - can be integrated with a map service later */}
          <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-2" />
              <p>Map view coming soon</p>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Host Information */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Hosted by</h2>
        <div className="flex items-start gap-4 p-6 rounded-lg border bg-card">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-2xl font-bold">
            H
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">Host</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Professional host</p>
              <p>Member since {new Date(property.created_at).getFullYear()}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Things to know */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Things to know</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold mb-2">House rules</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Check-in: After 3:00 PM</li>
              <li>Checkout: Before 11:00 AM</li>
              <li>Max {property.max_guests} guests</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Safety & property</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Security cameras on property</li>
              <li>Smoke alarm</li>
              <li>Carbon monoxide alarm</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Cancellation policy</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Free cancellation before 48 hours</li>
              <li>50% refund within 48 hours</li>
              <li>No refund after check-in</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
