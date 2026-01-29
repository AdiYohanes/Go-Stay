"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Property } from "@/types/property.types";
import { FavoriteButton } from "@/components/property/FavoriteButton";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Users,
  Bed,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * PropertyCard component - Clean, modern design
 * Requirements: 1.6, 7.2, 8.5
 *
 * Features:
 * - Clean solid color accents and badges
 * - Image carousel with smooth transitions
 * - Hover effects with subtle animations
 * - Clear typography hierarchy
 * - Indonesian Rupiah formatting
 * - Responsive and accessible
 */

interface PropertyCardProps {
  property: Property;
  initialIsFavorited?: boolean;
  showRating?: boolean;
  priority?: boolean;
}

// Color themes based on rating - solid colors
function getRatingColor(rating: number | null): {
  bg: string;
  text: string;
  star: string;
} {
  if (!rating)
    return { bg: "bg-gray-100", text: "text-gray-600", star: "text-gray-400" };
  if (rating >= 4.8)
    return {
      bg: "bg-emerald-500",
      text: "text-white",
      star: "text-yellow-300",
    };
  if (rating >= 4.5)
    return {
      bg: "bg-blue-500",
      text: "text-white",
      star: "text-yellow-300",
    };
  if (rating >= 4.0)
    return {
      bg: "bg-amber-500",
      text: "text-white",
      star: "text-yellow-200",
    };
  return { bg: "bg-gray-100", text: "text-gray-600", star: "text-gray-400" };
}

// Price tier badge - solid colors
function getPriceTier(price: number): {
  label: string;
  color: string;
  icon: string;
} {
  if (price >= 4000000)
    return {
      label: "Premium",
      color: "bg-amber-500",
      icon: "👑",
    };
  if (price >= 2000000)
    return {
      label: "Luxury",
      color: "bg-purple-500",
      icon: "💎",
    };
  if (price >= 1000000)
    return {
      label: "Superior",
      color: "bg-blue-500",
      icon: "⭐",
    };
  return {
    label: "Best Value",
    color: "bg-emerald-500",
    icon: "🌿",
  };
}

// Location badge color based on area - solid colors
function getLocationColor(location: string): string {
  if (location.includes("Uluwatu")) return "bg-orange-500";
  if (location.includes("Ubud")) return "bg-emerald-500";
  if (location.includes("Seminyak")) return "bg-pink-500";
  if (location.includes("Canggu")) return "bg-cyan-500";
  if (location.includes("Nusa Dua")) return "bg-purple-500";
  if (location.includes("Jimbaran")) return "bg-amber-500";
  if (location.includes("Sanur")) return "bg-yellow-500";
  if (location.includes("Legian")) return "bg-violet-500";
  return "bg-gray-500";
}

// Format Indonesian Rupiah
function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function PropertyCard({
  property,
  initialIsFavorited = false,
  showRating = true,
  priority = false,
}: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Use property images or placeholder
  const images =
    property.image_urls && property.image_urls.length > 0
      ? property.image_urls
      : [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
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

  const priceTier = getPriceTier(property.price_per_night);
  const ratingColor = getRatingColor(property.rating);
  const locationGradient = getLocationColor(property.location);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <Link
        href={`/property/${property.id}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl"
      >
        {/* Card Container with colorful hover effect */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:border-orange-200 dark:hover:border-orange-800">
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden">
            {/* Image Carousel */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentImageIndex}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src={images[currentImageIndex]}
                  alt={property.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className={cn(
                    "object-cover transition-transform duration-500",
                    isHovered && "scale-105",
                    !imageLoaded && "blur-sm",
                  )}
                  priority={priority && currentImageIndex === 0}
                  onLoad={() => setImageLoaded(true)}
                />
              </motion.div>
            </AnimatePresence>

            {/* Gradient Overlay - more colorful */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

            {/* Price Tier Badge with icon */}
            <div className="absolute top-3 left-3 z-10">
              <span
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-1.5 backdrop-blur-sm",
                  priceTier.color,
                )}
              >
                <span>{priceTier.icon}</span>
                {priceTier.label}
              </span>
            </div>

            {/* Carousel Navigation */}
            {images.length > 1 && (
              <>
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    x: isHovered ? 0 : -10,
                  }}
                  transition={{ duration: 0.2 }}
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white rounded-full p-2 shadow-lg transition-all hover:scale-110 active:scale-95"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-800" />
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, x: 10 }}
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    x: isHovered ? 0 : 10,
                  }}
                  transition={{ duration: 0.2 }}
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white rounded-full p-2 shadow-lg transition-all hover:scale-110 active:scale-95"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4 text-gray-800" />
                </motion.button>
              </>
            )}

            {/* Image Indicators - colorful */}
            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                {images.slice(0, 5).map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      index === currentImageIndex
                        ? "w-6 bg-orange-500 shadow-lg"
                        : "w-2 bg-white/70 hover:bg-white",
                    )}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
                {images.length > 5 && (
                  <span className="text-white/90 text-xs ml-1 font-medium">
                    +{images.length - 5}
                  </span>
                )}
              </div>
            )}

            {/* Favorite Button */}
            <div className="absolute top-3 right-3 z-10">
              <FavoriteButton
                propertyId={property.id}
                initialIsFavorited={initialIsFavorited}
              />
            </div>
          </div>

          {/* Property Details - more colorful */}
          <div className="p-4 space-y-3">
            {/* Title and Rating Row */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-base leading-tight text-gray-900 dark:text-white line-clamp-1 flex-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                {property.title}
              </h3>
              {showRating && property.rating && property.rating > 0 && (
                <div
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1 rounded-full shrink-0 shadow-sm",
                    ratingColor.bg,
                  )}
                >
                  <Star
                    className={cn("h-3.5 w-3.5 fill-current", ratingColor.star)}
                  />
                  <span className={cn("text-xs font-bold", ratingColor.text)}>
                    {property.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Location with solid color badge */}
            <div className="flex items-center gap-2">
              <div className={cn("p-1.5 rounded-lg", locationGradient)}>
                <MapPin className="h-3.5 w-3.5 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 line-clamp-1">
                {property.location}
              </p>
            </div>

            {/* Property Info Pills - solid colors */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <Bed className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                  {property.bedrooms} Kamar
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800">
                <Users className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                  {property.max_guests} Tamu
                </span>
              </div>
              {property.review_count > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  ({property.review_count} ulasan)
                </span>
              )}
            </div>

            {/* Price Section - solid color */}
            <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
                    {formatRupiah(property.price_per_night)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    / malam
                  </span>
                </div>
                <div className="text-[10px] px-2 py-1 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full font-semibold">
                  🇮🇩 Bali
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
