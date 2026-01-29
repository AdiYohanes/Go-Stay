"use client";

import React from "react";

interface DestinationProps {
  icon: string;
  label: string;
  region: string;
  subLabel: string;
  onClick?: () => void;
}

function DestinationItem({
  icon,
  label,
  region,
  subLabel,
  onClick,
}: DestinationProps) {
  return (
    <div
      className="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 rounded-xl cursor-pointer transition-all duration-200 active:scale-[0.98] group"
      onClick={onClick}
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center shrink-0 text-xl sm:text-2xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm truncate text-gray-900">
            {label}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded-full font-medium">
            {region}
          </span>
        </div>
        <span className="text-xs sm:text-sm text-muted-foreground truncate">
          {subLabel}
        </span>
      </div>
    </div>
  );
}

// Bali destination data - sesuai dengan lokasi resort yang ada
const BALI_DESTINATIONS = [
  {
    id: "seminyak",
    icon: "🏖️",
    label: "Seminyak",
    region: "Bali Selatan",
    subLabel: "Pantai, Restoran, Nightlife",
  },
  {
    id: "ubud",
    icon: "🌾",
    label: "Ubud",
    region: "Bali Tengah",
    subLabel: "Sawah, Seni, Budaya",
  },
  {
    id: "canggu",
    icon: "🏄",
    label: "Canggu",
    region: "Bali Selatan",
    subLabel: "Surfing, Cafe, Beach Club",
  },
  {
    id: "nusa-dua",
    icon: "🌴",
    label: "Nusa Dua",
    region: "Bali Selatan",
    subLabel: "Resort Mewah, Pantai Privat",
  },
  {
    id: "uluwatu",
    icon: "🏛️",
    label: "Uluwatu",
    region: "Bali Selatan",
    subLabel: "Cliff View, Temple, Surfing",
  },
  {
    id: "jimbaran",
    icon: "🦐",
    label: "Jimbaran",
    region: "Bali Selatan",
    subLabel: "Seafood, Sunset, Pantai",
  },
  {
    id: "sanur",
    icon: "🌅",
    label: "Sanur",
    region: "Bali Timur",
    subLabel: "Sunrise Beach, Tenang",
  },
  {
    id: "legian",
    icon: "🎉",
    label: "Legian",
    region: "Bali Selatan",
    subLabel: "Pantai, Bar, Entertainment",
  },
];

interface DestinationPickerProps {
  onSelect?: (value: string) => void;
}

export function DestinationPicker({ onSelect }: DestinationPickerProps) {
  return (
    <div className="bg-white rounded-none md:rounded-[32px] shadow-none md:shadow-2xl border-none md:border border-border/10 p-0 md:p-6 w-full md:w-[420px] flex flex-col mt-2 sm:mt-4">
      <div className="flex items-center gap-2 mb-3 px-1 sm:px-2">
        <span className="text-lg">🏝️</span>
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
          Destinasi Resort di Bali
        </h3>
      </div>
      <div className="flex flex-col gap-0.5 sm:gap-1 max-h-[400px] overflow-y-auto">
        {BALI_DESTINATIONS.map((dest) => (
          <DestinationItem
            key={dest.id}
            icon={dest.icon}
            label={dest.label}
            region={dest.region}
            subLabel={dest.subLabel}
            onClick={() => onSelect?.(dest.label)}
          />
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100 px-1 sm:px-2">
        <p className="text-[10px] text-muted-foreground text-center">
          🇮🇩 Menampilkan resort-resort terbaik di Pulau Dewata
        </p>
      </div>
    </div>
  );
}
