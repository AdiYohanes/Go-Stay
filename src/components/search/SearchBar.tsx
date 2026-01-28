"use client";

import React from "react";
import { Search, X, MapPin } from "lucide-react";
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
import { DateRange } from "react-day-picker";
import { SearchParams } from "@/types/search.types";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  initialValues?: Partial<SearchParams>;
  onSearch?: (params: SearchParams) => void;
  variant?: "hero" | "compact";
}

interface GuestCounts {
  adults: number;
  children: number;
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
            <div className="font-semibold text-sm">Adults</div>
            <div className="text-xs text-muted-foreground">
              Ages 13 or above
            </div>
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
            <span className="w-8 text-center">{value.adults}</span>
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
            <div className="font-semibold text-sm">Children</div>
            <div className="text-xs text-muted-foreground">Ages 2–12</div>
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
            <span className="w-8 text-center">{value.children}</span>
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
  const [location, setLocation] = React.useState(initialValues?.location || "");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    initialValues?.checkIn && initialValues?.checkOut
      ? {
          from: new Date(initialValues.checkIn),
          to: new Date(initialValues.checkOut),
        }
      : undefined,
  );
  const [guestCounts, setGuestCounts] = React.useState<GuestCounts>({
    adults: initialValues?.guests || 0,
    children: 0,
  });

  const [locationOpen, setLocationOpen] = React.useState(false);
  const [dateOpen, setDateOpen] = React.useState(false);
  const [guestsOpen, setGuestsOpen] = React.useState(false);
  const [mobileModalOpen, setMobileModalOpen] = React.useState(false);

  const totalGuests = guestCounts.adults + guestCounts.children;

  const handleSearch = () => {
    const params: SearchParams = {
      location: location || undefined,
      checkIn: dateRange?.from?.toISOString(),
      checkOut: dateRange?.to?.toISOString(),
      guests: totalGuests > 0 ? totalGuests : undefined,
    };

    // If onSearch callback is provided, use it
    if (onSearch) {
      onSearch(params);
    } else {
      // Otherwise, navigate to properties page with search params
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

  const formattedDate =
    dateRange?.from && dateRange?.to
      ? `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d")}`
      : dateRange?.from
        ? format(dateRange.from, "MMM d")
        : "Add dates";

  const isAnyOpen = locationOpen || dateOpen || guestsOpen;

  // Hero variant - expanded, prominent
  if (variant === "hero") {
    return (
      <>
        {/* Desktop Hero */}
        <div className="hidden lg:block">
          <div
            className={cn(
              "border rounded-full bg-white shadow-[0_6px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.16)] transition-all p-0 flex items-center border-border/20 h-[80px] w-full max-w-[880px]",
              isAnyOpen ? "bg-gray-100" : "bg-white",
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
                    Where
                  </div>
                  <div
                    className={cn(
                      "text-[15px] truncate",
                      location
                        ? "font-bold text-foreground"
                        : "font-medium text-muted-foreground/80",
                    )}
                  >
                    {location || "Search destinations"}
                  </div>
                  {!isAnyOpen && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-px bg-border/60 group-hover:opacity-0 transition-opacity"></div>
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent
                side="bottom"
                sideOffset={16}
                align="start"
                className="p-4 w-[400px]"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Where are you going?"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10"
                      autoFocus
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Dates */}
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <div
                  className={cn(
                    "flex-[1.2] flex flex-col justify-center px-8 rounded-full h-full transition-colors relative group hover:bg-gray-100/50 cursor-pointer",
                    dateOpen ? "bg-white shadow-lg z-10" : "",
                  )}
                >
                  <div className="text-xs font-bold tracking-wider text-foreground mb-0.5">
                    When
                  </div>
                  <div
                    className={cn(
                      "text-[15px] truncate",
                      dateRange?.from
                        ? "font-bold text-foreground"
                        : "font-medium text-muted-foreground/80",
                    )}
                  >
                    {formattedDate}
                  </div>
                  {!isAnyOpen && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-px bg-border/60 group-hover:opacity-0 transition-opacity"></div>
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
                />
              </PopoverContent>
            </Popover>

            {/* Guests */}
            <Popover open={guestsOpen} onOpenChange={setGuestsOpen}>
              <PopoverTrigger asChild>
                <div
                  className={cn(
                    "flex-1 flex items-center justify-between pl-8 pr-2 rounded-full h-full transition-colors hover:bg-gray-100/50 cursor-pointer",
                    guestsOpen ? "bg-white shadow-lg z-10" : "",
                  )}
                >
                  <div className="flex flex-col justify-center text-left">
                    <div className="text-xs font-bold tracking-wider text-foreground mb-0.5">
                      Who
                    </div>
                    <div
                      className={cn(
                        "text-[15px] truncate",
                        totalGuests > 0
                          ? "font-bold text-foreground"
                          : "font-medium text-muted-foreground/80",
                      )}
                    >
                      {totalGuests > 0 ? `${totalGuests} guests` : "Add guests"}
                    </div>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSearch();
                    }}
                    className={cn(
                      "bg-primary text-white rounded-full ml-2 hover:bg-primary/90 flex items-center justify-center overflow-hidden shadow-md active:scale-95 transition-all duration-300 ease-out",
                      isAnyOpen ? "px-6 py-3.5 gap-2 h-12 w-auto" : "h-14 w-14",
                    )}
                  >
                    <Search
                      className={cn(
                        "stroke-[3px] shrink-0",
                        isAnyOpen ? "h-4 w-4" : "h-6 w-6",
                      )}
                    />
                    <span
                      className={cn(
                        "font-bold text-base whitespace-nowrap transition-all duration-300 ease-in-out",
                        isAnyOpen
                          ? "opacity-100 max-w-[100px] translate-x-0"
                          : "opacity-0 max-w-0 -translate-x-4 hidden",
                      )}
                    >
                      Search
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

        {/* Mobile Hero - Modal expansion */}
        <div className="block lg:hidden w-full px-4">
          <button
            onClick={() => setMobileModalOpen(true)}
            className="w-full bg-white/95 backdrop-blur-md rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-white/20 p-3 pl-4 flex items-center gap-3 transition-transform active:scale-[0.98]"
          >
            <Search className="h-5 w-5 text-foreground/80 stroke-[2.5px] shrink-0" />
            <div className="flex flex-col items-start flex-1 min-w-0">
              <span className="font-bold text-sm text-foreground truncate w-full text-left">
                {location || "Where to?"}
              </span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="truncate max-w-[120px]">{formattedDate}</span>
                <span className="shrink-0">•</span>
                <span className="shrink-0">
                  {totalGuests > 0 ? `${totalGuests} guests` : "Add guests"}
                </span>
              </div>
            </div>
            <div className="bg-primary p-2.5 rounded-full shrink-0">
              <Search className="h-4 w-4 text-white" />
            </div>
          </button>
        </div>
      </>
    );
  }

  // Compact variant - header, minimal
  return (
    <>
      {/* Desktop Compact */}
      <div className="hidden md:block">
        <button
          onClick={() => setMobileModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-full shadow-sm hover:shadow-md transition-all"
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            {location || "Search"}
          </span>
          {(dateRange?.from || totalGuests > 0) && (
            <>
              <div className="h-4 w-px bg-border" />
              <span className="text-sm text-muted-foreground">
                {dateRange?.from && format(dateRange.from, "MMM d")}
                {totalGuests > 0 && ` • ${totalGuests} guests`}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Mobile Compact */}
      <div className="block md:hidden">
        <button
          onClick={() => setMobileModalOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-border rounded-full shadow-sm active:scale-95 transition-transform"
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Search</span>
        </button>
      </div>
    </>
  );

  // Mobile Modal (shared between variants)
  return (
    <>
      {mobileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200 max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white shrink-0">
              <button
                onClick={() => setMobileModalOpen(false)}
                className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <span className="font-semibold text-base">Search</span>
              <button
                onClick={handleClear}
                className="text-sm font-medium text-primary hover:text-primary/80"
              >
                Clear
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Where</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search destinations"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-2">
                <label className="text-sm font-medium">When</label>
                <CalendarComponent
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={1}
                  disabled={{ before: new Date() }}
                />
              </div>

              {/* Guests */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Who</label>
                <GuestsPopover value={guestCounts} onChange={setGuestCounts} />
              </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 p-4 border-t border-gray-200 bg-white">
              <Button
                onClick={handleSearch}
                className="w-full bg-primary text-white rounded-xl flex items-center justify-center gap-2"
              >
                <Search className="h-5 w-5" />
                Search
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
