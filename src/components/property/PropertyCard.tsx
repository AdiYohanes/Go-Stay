"use client";

import Link from "next/link";
import { Database } from "@/types/database.types";
import { FavoriteButton } from "@/components/property/FavoriteButton";

type Property = Database["public"]["Tables"]["properties"]["Row"];

interface PropertyCardProps {
  property: Property;
  initialIsFavorited?: boolean;
}

export function PropertyCard({
  property,
  initialIsFavorited = false,
}: PropertyCardProps) {
  // Use first image or placeholder
  const imageUrl =
    property.image_urls?.[0] ||
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=500";

  return (
    <Link
      href={`/property/${property.id}`}
      className="group block h-full relative cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted mb-3">
        <img
          src={imageUrl}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Favorite Button */}
        <div className="absolute bottom-3 right-3 md:top-3 md:right-3 z-10">
          <FavoriteButton
            propertyId={property.id}
            initialIsFavorited={initialIsFavorited}
          />
        </div>

        {/* Guest Favorite Badge */}
        {property.max_guests > 4 && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-[2px] px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-black/5">
            Guest favorite
          </div>
        )}
      </div>

      <div className="grid gap-0.5">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-[15px] leading-5 text-foreground truncate">
            {property.location}
          </h3>
          <div className="flex items-center gap-1 text-[14px]">
            <span className="text-xs">★</span>
            <span>4.91</span>
          </div>
        </div>

        <p className="text-muted-foreground text-[15px] leading-5 truncate">
          {property.max_guests > 5 ? "Masked view" : "City views"}
        </p>
        <p className="text-muted-foreground text-[15px] leading-5">
          Nov 5 – 10
        </p>

        <div className="mt-1 flex items-baseline gap-1 text-[15px]">
          <span className="font-semibold">${property.price_per_night}</span>
          <span className="text-foreground">night</span>
        </div>
      </div>
    </Link>
  );
}
