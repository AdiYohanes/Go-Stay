"use client";

import React, { useState, useMemo } from "react";
import { Search, X, MapPin, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { SearchParams } from "@/types/search.types";
import { useRouter } from "next/navigation";
import { LOCATION_OPTIONS } from "@/lib/mock-data";

interface SearchBarProps {
  initialValues?: Partial<SearchParams>;
  onSearch?: (params: SearchParams) => void;
  variant?: "hero" | "compact";
}

interface GuestCounts {
  adults: number;
  children: number;
}

// Bali location dropdown component
function LocationDropdown({
  value,
  onChange,
  onClose,
}: {
  value: string;
  onChange: (location: string) => void;
  onClose: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLocations = useMemo(() => {
    if (!searchQuery) return LOCATION_OPTIONS;
    const query = searchQuery.toLowerCase();
    return LOCATION_OPTIONS.filter(
      (loc) =>
        loc.name.toLowerCase().includes(query) ||
        loc.region.toLowerCase().includes(query) ||
        loc.description.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  return (
    <div className="w-full min-w-[380px] bg-white rounded-2xl shadow-xl border border-border/10 overflow-hidden">
      {/* Search Input */}
      <div className="p-4 border-b border-border/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari destinasi di Bali..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
            autoFocus
          />
        </div>
      </div>

      {/* Location List */}
      <div className="max-h-[320px] overflow-y-auto">
        <div className="p-2">
          <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Destinasi Populer di Bali
          </p>
          {filteredLocations.map((location) => (
            <button
              key={location.id}
              onClick={() => {
                onChange(`${location.name}, Bali`);
                onClose();
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-left",
                value === `${location.name}, Bali`
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted/80",
              )}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 text-lg">
                {location.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-foreground">
                  {location.name}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {location.region} • {location.description}
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </button>
          ))}
          {filteredLocations.length === 0 && (
            <div className="px-3 py-8 text-center text-muted-foreground">
              <p className="text-sm">Tidak ada hasil untuk "{searchQuery}"</p>
              <p className="text-xs mt-1">Coba kata kunci lain</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GuestsPopover({
  value,
  onChange,
}: {
  value: GuestCounts;
  onChange: (counts: GuestCounts) => void;
}) {
  return (
    <div className="w-full min-w-[300px] p-4 bg-white rounded-2xl shadow-xl border border-border/10">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-sm">Dewasa</div>
            <div className="text-xs text-muted-foreground">Usia 13+</div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() =>
                onChange({ ...value, adults: Math.max(0, value.adults - 1) })
              }
              disabled={value.adults === 0}
            >
              <span className="text-lg">−</span>
            </Button>
            <span className="w-8 text-center font-medium">{value.adults}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => onChange({ ...value, adults: value.adults + 1 })}
            >
              <span className="text-lg">+</span>
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-sm">Anak-anak</div>
            <div className="text-xs text-muted-foreground">Usia 2–12</div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() =>
                onChange({
                  ...value,
                  children: Math.max(0, value.children - 1),
                })
              }
              disabled={value.children === 0}
            >
              <span className="text-lg">−</span>
            </Button>
            <span className="w-8 text-center font-medium">
              {value.children}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() =>
                onChange({ ...value, children: value.children + 1 })
              }
            >
              <span className="text-lg">+</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SearchBar({
  initialValues,
  onSearch,
  variant = "hero",
}: SearchBarProps) {
  const router = useRouter();
  const [location, setLocation] = useState(initialValues?.location || "");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    initialValues?.checkIn && initialValues?.checkOut
      ? {
          from: new Date(initialValues.checkIn),
          to: new Date(initialValues.checkOut),
        }
      : undefined,
  );
  const [guestCounts, setGuestCounts] = useState<GuestCounts>({
    adults: initialValues?.guests || 0,
    children: 0,
  });

  const [locationOpen, setLocationOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [mobileModalOpen, setMobileModalOpen] = useState(false);

  const totalGuests = guestCounts.adults + guestCounts.children;

  const handleSearch = () => {
    const params: SearchParams = {
      location: location || undefined,
      checkIn: dateRange?.from?.toISOString(),
      checkOut: dateRange?.to?.toISOString(),
      guests: totalGuests > 0 ? totalGuests : undefined,
    };

    if (onSearch) {
      onSearch(params);
    } else {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, String(value));
        }
      });
      router.push(`/properties?${searchParams.toString()}`);
    }

    setMobileModalOpen(false);
  };

  const handleClear = () => {
    setLocation("");
    setDateRange(undefined);
    setGuestCounts({ adults: 0, children: 0 });
  };

  const formattedDate = useMemo(() => {
    if (!dateRange?.from) {
      return "Pilih tanggal";
    }

    // Jika hanya ada tanggal from atau from dan to sama, tampilkan satu tanggal saja
    if (!dateRange.to || dateRange.from.getTime() === dateRange.to.getTime()) {
      return format(dateRange.from, "d MMM", { locale: id });
    }

    // Jika ada range tanggal yang berbeda, tampilkan range
    return `${format(dateRange.from, "d MMM", { locale: id })} - ${format(dateRange.to, "d MMM", { locale: id })}`;
  }, [dateRange]);

  const isAnyOpen = locationOpen || dateOpen || guestsOpen;

  // Hero variant - expanded, prominent
  if (variant === "hero") {
    return (
      <>
        {/* Desktop Hero */}
        <div className="hidden lg:block">
          <div
            className={cn(
              "border rounded-full bg-white shadow-[0_6px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.16)] transition-all p-0 flex items-center border-border/20 h-[72px] w-full max-w-[880px] mx-auto",
              isAnyOpen ? "bg-gray-50" : "bg-white",
            )}
          >
            {/* Location */}
            <Popover open={locationOpen} onOpenChange={setLocationOpen}>
              <PopoverTrigger asChild>
                <div
                  className={cn(
                    "flex-1 flex flex-col justify-center pl-8 pr-4 rounded-full h-full transition-colors relative group hover:bg-gray-100/50 cursor-pointer",
                    locationOpen ? "bg-white shadow-lg z-10" : "",
                  )}
                >
                  <div className="text-xs font-bold tracking-wider text-foreground mb-0.5">
                    Lokasi
                  </div>
                  <div
                    className={cn(
                      "text-[15px] truncate",
                      location
                        ? "font-semibold text-foreground"
                        : "font-medium text-muted-foreground/80",
                    )}
                  >
                    {location || "Cari destinasi"}
                  </div>
                  {!isAnyOpen && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-px bg-border/60 group-hover:opacity-0 transition-opacity" />
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent
                side="bottom"
                sideOffset={16}
                align="start"
                className="p-0 border-none bg-transparent shadow-none w-auto"
              >
                <LocationDropdown
                  value={location}
                  onChange={setLocation}
                  onClose={() => setLocationOpen(false)}
                />
              </PopoverContent>
            </Popover>

            {/* Dates */}
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <div
                  className={cn(
                    "flex-[1.2] flex flex-col justify-center px-6 rounded-full h-full transition-colors relative group hover:bg-gray-100/50 cursor-pointer",
                    dateOpen ? "bg-white shadow-lg z-10" : "",
                  )}
                >
                  <div className="text-xs font-bold tracking-wider text-foreground mb-0.5">
                    Tanggal
                  </div>
                  <div
                    className={cn(
                      "text-[15px] truncate",
                      dateRange?.from
                        ? "font-semibold text-foreground"
                        : "font-medium text-muted-foreground/80",
                    )}
                  >
                    {formattedDate}
                  </div>
                  {!isAnyOpen && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-px bg-border/60 group-hover:opacity-0 transition-opacity" />
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent
                side="bottom"
                sideOffset={16}
                align="center"
                className="p-4 w-auto"
              >
                <CalendarComponent
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  disabled={{ before: new Date() }}
                  locale={id}
                />
              </PopoverContent>
            </Popover>

            {/* Guests */}
            <Popover open={guestsOpen} onOpenChange={setGuestsOpen}>
              <PopoverTrigger asChild>
                <div
                  className={cn(
                    "flex-1 flex items-center justify-between pl-6 pr-2 rounded-full h-full transition-colors hover:bg-gray-100/50 cursor-pointer",
                    guestsOpen ? "bg-white shadow-lg z-10" : "",
                  )}
                >
                  <div className="flex flex-col justify-center text-left">
                    <div className="text-xs font-bold tracking-wider text-foreground mb-0.5">
                      Tamu
                    </div>
                    <div
                      className={cn(
                        "text-[15px] truncate",
                        totalGuests > 0
                          ? "font-semibold text-foreground"
                          : "font-medium text-muted-foreground/80",
                      )}
                    >
                      {totalGuests > 0 ? `${totalGuests} tamu` : "Tambah tamu"}
                    </div>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSearch();
                    }}
                    className={cn(
                      "bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full ml-2 hover:from-emerald-600 hover:to-teal-600 flex items-center justify-center overflow-hidden shadow-md active:scale-95 transition-all duration-300 ease-out",
                      isAnyOpen ? "px-6 py-3 gap-2 h-12 w-auto" : "h-12 w-12",
                    )}
                  >
                    <Search
                      className={cn(
                        "stroke-[2.5px] shrink-0",
                        isAnyOpen ? "h-4 w-4" : "h-5 w-5",
                      )}
                    />
                    <span
                      className={cn(
                        "font-semibold text-sm whitespace-nowrap transition-all duration-300 ease-in-out",
                        isAnyOpen
                          ? "opacity-100 max-w-[100px] translate-x-0"
                          : "opacity-0 max-w-0 -translate-x-4 hidden",
                      )}
                    >
                      Cari
                    </span>
                  </Button>
                </div>
              </PopoverTrigger>
              <PopoverContent
                side="bottom"
                sideOffset={16}
                align="end"
                className="p-0 border-none bg-transparent shadow-none w-auto"
              >
                <GuestsPopover value={guestCounts} onChange={setGuestCounts} />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Mobile Hero */}
        <div className="block lg:hidden w-full max-w-[600px] mx-auto px-4">
          <button
            onClick={() => setMobileModalOpen(true)}
            className="w-full bg-white/95 backdrop-blur-md rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-white/20 p-3 pl-4 flex items-center gap-3 transition-transform active:scale-[0.98]"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500">
              <Search className="h-5 w-5 text-white stroke-[2.5px]" />
            </div>
            <div className="flex flex-col items-start flex-1 min-w-0">
              <span className="font-bold text-sm text-foreground truncate w-full text-left">
                {location || "Mau ke mana?"}
              </span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="truncate max-w-[120px]">{formattedDate}</span>
                <span className="shrink-0">•</span>
                <span className="shrink-0">
                  {totalGuests > 0 ? `${totalGuests} tamu` : "Tambah tamu"}
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Mobile Modal */}
        {mobileModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileModalOpen(false)}
            />
            <div className="relative w-full h-full bg-white overflow-hidden animate-in slide-in-from-bottom duration-300 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white shrink-0">
                <button
                  onClick={() => setMobileModalOpen(false)}
                  className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                <span className="font-semibold text-base">Cari Resort</span>
                <button
                  onClick={handleClear}
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                  Reset
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Location */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground">
                    Lokasi
                  </label>
                  <LocationDropdown
                    value={location}
                    onChange={setLocation}
                    onClose={() => {}}
                  />
                </div>

                {/* Dates */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground">
                    Tanggal Menginap
                  </label>
                  <CalendarComponent
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={1}
                    disabled={{ before: new Date() }}
                    locale={id}
                    className="rounded-xl border"
                  />
                </div>

                {/* Guests */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground">
                    Jumlah Tamu
                  </label>
                  <GuestsPopover
                    value={guestCounts}
                    onChange={setGuestCounts}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="shrink-0 p-4 border-t border-gray-200 bg-white">
                <Button
                  onClick={handleSearch}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl h-12 flex items-center justify-center gap-2 font-semibold"
                >
                  <Search className="h-5 w-5" />
                  Cari Resort
                </Button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Compact variant
  return (
    <>
      <div className="hidden md:block">
        <button
          onClick={() => setMobileModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-full shadow-sm hover:shadow-md transition-all"
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            {location || "Cari"}
          </span>
          {(dateRange?.from || totalGuests > 0) && (
            <>
              <div className="h-4 w-px bg-border" />
              <span className="text-sm text-muted-foreground">
                {dateRange?.from &&
                  format(dateRange.from, "d MMM", { locale: id })}
                {totalGuests > 0 && ` • ${totalGuests} tamu`}
              </span>
            </>
          )}
        </button>
      </div>

      <div className="block md:hidden">
        <button
          onClick={() => setMobileModalOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-border rounded-full shadow-sm active:scale-95 transition-transform"
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Cari</span>
        </button>
      </div>
    </>
  );
}
