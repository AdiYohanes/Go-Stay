"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GuestCounterProps {
  label: string;
  subLabel: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

function GuestCounter({
  label,
  subLabel,
  value,
  onChange,
  disabled,
}: GuestCounterProps) {
  return (
    <div className="flex items-center justify-between py-3 sm:py-4 border-b last:border-0">
      <div className="flex flex-col min-w-0 flex-1 mr-3">
        <span className="font-semibold text-sm sm:text-base">{label}</span>
        <span className="text-xs sm:text-sm text-muted-foreground truncate">
          {subLabel}
        </span>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full border-muted-foreground/50 hover:border-black disabled:opacity-20"
          onClick={() => onChange(Math.max(0, value - 1))}
          disabled={value === 0 || disabled}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-6 text-center tabular-nums text-sm sm:text-base">
          {value}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full border-muted-foreground/50 hover:border-black"
          onClick={() => onChange(value + 1)}
          disabled={disabled}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

interface GuestsSelectorProps {
  onCountsChange?: (counts: {
    adults: number;
    children: number;
    infants: number;
    pets: number;
  }) => void;
}

export function GuestsSelector({ onCountsChange }: GuestsSelectorProps) {
  const [counts, setCounts] = useState({
    adults: 0,
    children: 0,
    infants: 0,
    pets: 0,
  });

  const updateCount = (key: keyof typeof counts, value: number) => {
    const newCounts = { ...counts, [key]: value };
    setCounts(newCounts);
    onCountsChange?.(newCounts);
  };

  return (
    <div className="w-full md:min-w-[400px] p-3 sm:p-4 bg-background rounded-2xl sm:rounded-3xl shadow-xl border border-border/10">
      <GuestCounter
        label="Adults"
        subLabel="Ages 13 or above"
        value={counts.adults}
        onChange={(v) => updateCount("adults", v)}
      />
      <GuestCounter
        label="Children"
        subLabel="Ages 2–12"
        value={counts.children}
        onChange={(v) => updateCount("children", v)}
      />
      <GuestCounter
        label="Infants"
        subLabel="Under 2"
        value={counts.infants}
        onChange={(v) => updateCount("infants", v)}
      />
      <GuestCounter
        label="Pets"
        subLabel="Bringing a service animal?"
        value={counts.pets}
        onChange={(v) => updateCount("pets", v)}
      />
    </div>
  );
}
