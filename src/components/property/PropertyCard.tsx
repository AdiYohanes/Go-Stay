"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Property } from "@/types/property.types";
import { FavoriteButton } from "@/components/property/FavoriteButton";
import { AvailabilityIndicator } from "@/components/booking/AvailabilityIndicator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { ShoppingCart, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { addToCart } from "@/actions/cart";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * PropertyCard component with animations
 * Requirements: 1.6, 7.2, 8.5
 *
 * Features:
 * - Image carousel with Framer Motion transitions
 * - Hover scale and shadow animations
 * - Display price, location, rating, amenities preview
 * - Integrate FavoriteButton and AvailabilityIndicator
 * - Add "Add to Cart" button with date/guest selection popover
 */

interface PropertyCardProps {
  property: Property;
  initialIsFavorited?: boolean;
  showRating?: boolean;
  checkIn?: Date | null;
  checkOut?: Date | null;
}

export function PropertyCard({
  property,
  initialIsFavorited = false,
  showRating = true,
  checkIn = null,
  checkOut = null,
}: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedCheckIn, setSelectedCheckIn] = useState<Date | undefined>(
    checkIn || undefined,
  );
  const [selectedCheckOut, setSelectedCheckOut] = useState<Date | undefined>(
    checkOut || undefined,
  );
  const [guests, setGuests] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const incrementItemCount = useCartStore((state) => state.incrementItemCount);

  // Use property images or placeholder
  const images =
    property.image_urls && property.image_urls.length > 0
      ? property.image_urls
      : [
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=500",
        ];

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedCheckIn || !selectedCheckOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    if (guests < 1 || guests > property.max_guests) {
      toast.error(`Guests must be between 1 and ${property.max_guests}`);
      return;
    }

    setIsAddingToCart(true);

    try {
      const result = await addToCart({
        property_id: property.id,
        check_in: selectedCheckIn,
        check_out: selectedCheckOut,
        guests,
      });

      if (result.success) {
        toast.success("Added to cart");
        incrementItemCount();
        setPopoverOpen(false);
      } else {
        toast.error(result.error || "Failed to add to cart");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Display top 3 amenities
  const displayAmenities = property.amenities?.slice(0, 3) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group block h-full relative"
    >
      <Link href={`/property/${property.id}`} className="block">
        {/* Image Carousel */}
        <div className="relative aspect-square overflow-hidden rounded-xl bg-muted mb-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              className="relative h-full w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={images[currentImageIndex]}
                alt={`${property.title} - Image ${currentImageIndex + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
                priority={currentImageIndex === 0}
              />
            </motion.div>
          </AnimatePresence>

          {/* Carousel Navigation */}
          {images.length > 1 && isHovered && (
            <>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4" />
              </motion.button>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4" />
              </motion.button>
            </>
          )}

          {/* Image Indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    index === currentImageIndex
                      ? "w-6 bg-white"
                      : "w-1.5 bg-white/60",
                  )}
                />
              ))}
            </div>
          )}

          {/* Favorite Button */}
          <div className="absolute top-3 right-3 z-10">
            <FavoriteButton
              propertyId={property.id}
              initialIsFavorited={initialIsFavorited}
            />
          </div>

          {/* Rating Badge */}
          {showRating && property.rating && (
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-[2px] px-2 py-1 rounded-lg text-xs font-semibold shadow-sm border border-black/5 flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              <span>{property.rating.toFixed(1)}</span>
              {property.review_count > 0 && (
                <span className="text-muted-foreground">
                  ({property.review_count})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="space-y-1">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-[15px] leading-5 text-foreground truncate">
              {property.title}
            </h3>
          </div>

          <p className="text-muted-foreground text-sm truncate">
            {property.location}
          </p>

          {/* Amenities Preview */}
          {displayAmenities.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {displayAmenities.map((amenity, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {property.amenities && property.amenities.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{property.amenities.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Availability Indicator */}
          {selectedCheckIn && selectedCheckOut && (
            <AvailabilityIndicator
              propertyId={property.id}
              startDate={selectedCheckIn}
              endDate={selectedCheckOut}
              variant="compact"
              className="mt-2"
            />
          )}

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between mt-2 pt-2">
            <div className="flex items-baseline gap-1">
              <span className="font-semibold text-base">
                ${property.price_per_night}
              </span>
              <span className="text-sm text-muted-foreground">night</span>
            </div>

            {/* Add to Cart Popover */}
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Select Dates</h4>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-xs">Check-in</Label>
                        <Calendar
                          mode="single"
                          selected={selectedCheckIn}
                          onSelect={setSelectedCheckIn}
                          disabled={(date) => date < new Date()}
                          className="rounded-md border"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Check-out</Label>
                        <Calendar
                          mode="single"
                          selected={selectedCheckOut}
                          onSelect={setSelectedCheckOut}
                          disabled={(date) =>
                            date < new Date() ||
                            (selectedCheckIn ? date <= selectedCheckIn : false)
                          }
                          className="rounded-md border"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">Guests</Label>
                    <div className="flex items-center gap-3 mt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setGuests(Math.max(1, guests - 1));
                        }}
                        disabled={guests <= 1}
                      >
                        -
                      </Button>
                      <div className="flex items-center gap-1.5 min-w-[60px] justify-center">
                        <Users className="h-4 w-4" />
                        <span className="font-medium">{guests}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setGuests(Math.min(property.max_guests, guests + 1));
                        }}
                        disabled={guests >= property.max_guests}
                      >
                        +
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Max {property.max_guests} guests
                    </p>
                  </div>

                  {selectedCheckIn && selectedCheckOut && (
                    <AvailabilityIndicator
                      propertyId={property.id}
                      startDate={selectedCheckIn}
                      endDate={selectedCheckOut}
                      showConflictingDates={true}
                    />
                  )}

                  <Button
                    onClick={handleAddToCart}
                    disabled={
                      !selectedCheckIn || !selectedCheckOut || isAddingToCart
                    }
                    className="w-full"
                  >
                    {isAddingToCart ? "Adding..." : "Add to Cart"}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
