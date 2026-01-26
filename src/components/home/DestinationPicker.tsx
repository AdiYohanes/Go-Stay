"use client";

import React from "react";

interface DestinationProps {
  icon: React.ReactNode;
  label: string;
  subLabel: string;
  onClick?: () => void;
}

function DestinationItem({ icon, label, subLabel, onClick }: DestinationProps) {
  return (
    <div
      className="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 hover:bg-muted/50 rounded-xl cursor-pointer transition-colors active:scale-[0.98]"
      onClick={onClick}
    >
      {icon}
      <div className="flex flex-col min-w-0 flex-1">
        <span className="font-semibold text-sm truncate">{label}</span>
        <span className="text-xs sm:text-sm text-muted-foreground truncate">
          {subLabel}
        </span>
      </div>
    </div>
  );
}

// Simple icon components with gradient backgrounds
function NearbyIcon() {
  return (
    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shrink-0">
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5 text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
      </svg>
    </div>
  );
}

function MountainIcon() {
  return (
    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shrink-0">
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5 text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m8 3 4 8 5-5 5 15H2L8 3z"></path>
      </svg>
    </div>
  );
}

function TempleIcon() {
  return (
    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0">
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5 text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 21h18"></path>
        <path d="M5 21V7l7-4 7 4v14"></path>
        <path d="M9 21v-6h6v6"></path>
      </svg>
    </div>
  );
}

function TreeIcon() {
  return (
    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shrink-0">
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5 text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m17 14-5-5-5 5"></path>
        <path d="m17 9-5-5-5 5"></path>
        <path d="M12 22V9"></path>
      </svg>
    </div>
  );
}

function BeachIcon() {
  return (
    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shrink-0">
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5 text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M12 2v2"></path>
        <path d="M12 20v2"></path>
        <path d="m4.93 4.93 1.41 1.41"></path>
        <path d="m17.66 17.66 1.41 1.41"></path>
        <path d="M2 12h2"></path>
        <path d="M20 12h2"></path>
        <path d="m6.34 17.66-1.41 1.41"></path>
        <path d="m19.07 4.93-1.41 1.41"></path>
      </svg>
    </div>
  );
}

function CityIcon() {
  return (
    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center shrink-0">
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5 text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
        <path d="M9 22v-4h6v4"></path>
        <path d="M8 6h.01"></path>
        <path d="M16 6h.01"></path>
        <path d="M12 6h.01"></path>
        <path d="M12 10h.01"></path>
        <path d="M12 14h.01"></path>
        <path d="M16 10h.01"></path>
        <path d="M16 14h.01"></path>
        <path d="M8 10h.01"></path>
        <path d="M8 14h.01"></path>
      </svg>
    </div>
  );
}

interface DestinationPickerProps {
  onSelect?: (value: string) => void;
}

export function DestinationPicker({ onSelect }: DestinationPickerProps) {
  return (
    <div className="bg-white rounded-none md:rounded-[32px] shadow-none md:shadow-2xl border-none md:border border-border/10 p-0 md:p-6 w-full md:w-[400px] flex flex-col mt-2 sm:mt-4">
      <h3 className="text-xs font-bold text-muted-foreground mb-2 sm:mb-3 px-1 sm:px-2">
        Destinasi yang disarankan
      </h3>
      <div className="flex flex-col gap-0.5 sm:gap-1">
        <DestinationItem
          icon={<NearbyIcon />}
          label="Di dekat lokasi Anda"
          subLabel="Cari tahu apa yang ada di sekitar Anda"
          onClick={() => onSelect?.("Nearby")}
        />
        <DestinationItem
          icon={<MountainIcon />}
          label="Bandung, Jawa Barat"
          subLabel="Sangat cocok untuk liburan akhir pekan"
          onClick={() => onSelect?.("Bandung")}
        />
        <DestinationItem
          icon={<TempleIcon />}
          label="Yogyakarta, Yogyakarta"
          subLabel="Untuk pemandangan seperti Candi Borobudur"
          onClick={() => onSelect?.("Yogyakarta")}
        />
        <DestinationItem
          icon={<TreeIcon />}
          label="Lembang, Jawa Barat"
          subLabel="Sangat cocok untuk liburan akhir pekan"
          onClick={() => onSelect?.("Lembang")}
        />
        <DestinationItem
          icon={<BeachIcon />}
          label="Kuta, Bali"
          subLabel="Destinasi pantai populer"
          onClick={() => onSelect?.("Bali")}
        />
        <DestinationItem
          icon={<CityIcon />}
          label="Jakarta Selatan, Jakarta"
          subLabel="Di dekat Anda"
          onClick={() => onSelect?.("Jakarta")}
        />
      </div>
    </div>
  );
}
