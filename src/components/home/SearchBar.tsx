"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { GuestsSelector } from "./GuestsSelector";

import { DatePicker } from "./DatePicker";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import { DestinationPicker } from "./DestinationPicker";

export function SearchBar() {
  const [totalGuests, setTotalGuests] = React.useState(0);
  const [guestOpen, setGuestOpen] = React.useState(false);
  const [dateOpen, setDateOpen] = React.useState(false);
  const [destinationOpen, setDestinationOpen] = React.useState(false);
  const [destination, setDestination] = React.useState("");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [flexDays, setFlexDays] = React.useState(0);
  const [flexibleMode, setFlexibleMode] = React.useState<
    { duration: string; months: string[] } | undefined
  >();

  // Mobile modal state
  const [mobileModalOpen, setMobileModalOpen] = React.useState(false);
  const [mobileActiveTab, setMobileActiveTab] = React.useState<
    "where" | "when" | "who"
  >("where");

  const handleGuestsChange = (counts: {
    adults: number;
    children: number;
    infants: number;
    pets: number;
  }) => {
    setTotalGuests(counts.adults + counts.children);
  };

  const handleDateSelect = (
    range: DateRange | undefined,
    days?: number,
    flexible?: { duration: string; months: string[] },
  ) => {
    if (flexible && flexible.months.length > 0) {
      setDateRange(undefined);
      setFlexDays(0);
      setFlexibleMode(flexible);
    } else {
      setDateRange(range);
      setFlexDays(days || 0);
      setFlexibleMode(undefined);
    }
  };

  const handleDestinationSelect = (value: string) => {
    setDestination(value);
    setDestinationOpen(false);
    // On mobile, move to next step
    if (mobileModalOpen) {
      setMobileActiveTab("when");
    }
  };

  const handleClearAll = () => {
    setDestination("");
    setDateRange(undefined);
    setFlexDays(0);
    setFlexibleMode(undefined);
    setTotalGuests(0);
  };

  let formattedDate = "Add dates";

  if (flexibleMode && flexibleMode.months.length > 0) {
    const monthsText =
      flexibleMode.months.length === 1
        ? flexibleMode.months[0]
        : flexibleMode.months.length <= 2
          ? flexibleMode.months.join(", ")
          : `${flexibleMode.months[0]} + ${flexibleMode.months.length - 1} lainnya`;
    formattedDate = `${flexibleMode.duration} • ${monthsText}`;
  } else if (dateRange?.from) {
    if (flexDays > 0) {
      formattedDate = `${format(dateRange.from, "d MMM")} ±${flexDays}`;
    } else if (dateRange.to) {
      const fromYear = dateRange.from.getFullYear();
      const toYear = dateRange.to.getFullYear();

      if (fromYear !== toYear) {
        formattedDate = `${format(dateRange.from, "d MMM yyyy")} – ${format(dateRange.to, "d MMM yyyy")}`;
      } else {
        formattedDate = `${format(dateRange.from, "d MMM")} – ${format(dateRange.to, "d MMM")}`;
      }
    } else {
      formattedDate = format(dateRange.from, "d MMM");
    }
  }

  const isAnyOpen = destinationOpen || dateOpen || guestOpen;

  return (
    <>
      {/* Desktop (Large Screens) */}
      <div className="hidden lg:block">
        <div
          className={cn(
            "border rounded-full bg-white shadow-[0_6px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.16)] transition-all cursor-pointer p-0 flex items-center border-border/20 h-[80px] w-full max-w-[880px]",
            isAnyOpen ? "bg-gray-100" : "bg-white",
          )}
        >
          {/* Location */}
          <Popover open={destinationOpen} onOpenChange={setDestinationOpen}>
            <PopoverTrigger asChild>
              <div
                className={cn(
                  "flex-1 flex flex-col justify-center pl-8 pr-4 rounded-full h-full transition-colors relative group hover:bg-gray-100/50",
                  destinationOpen ? "bg-white shadow-lg z-10" : "",
                )}
              >
                <div className="text-xs font-extra-bold tracking-wider text-foreground mb-0.5">
                  Where
                </div>
                <div
                  className={cn(
                    "text-[15px] truncate",
                    destination
                      ? "font-bold text-foreground"
                      : "font-medium text-muted-foreground/80",
                  )}
                >
                  {destination || "Search destinations"}
                </div>
                {!isAnyOpen && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-px bg-border/60 group-hover:opacity-0 transition-opacity"></div>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              sideOffset={16}
              align="start"
              className="p-0 border-none bg-transparent shadow-none w-auto"
              avoidCollisions={false}
            >
              <DestinationPicker onSelect={handleDestinationSelect} />
            </PopoverContent>
          </Popover>

          {/* Date */}
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <div
                className={cn(
                  "flex-[1.2] flex flex-col justify-center px-8 rounded-full h-full transition-colors relative group hover:bg-gray-100/50",
                  dateOpen ? "bg-white shadow-lg z-10" : "",
                )}
              >
                <div className="text-xs font-extra-bold tracking-wider text-foreground mb-0.5">
                  Kapan
                </div>
                <div
                  className={cn(
                    "text-[15px] truncate",
                    dateRange?.from || flexibleMode
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
              side="top"
              sideOffset={16}
              align="center"
              className="p-0 border-none bg-transparent shadow-none w-auto"
              avoidCollisions={false}
            >
              <DatePicker value={dateRange} onSelect={handleDateSelect} />
            </PopoverContent>
          </Popover>

          {/* Guests */}
          <Popover open={guestOpen} onOpenChange={setGuestOpen}>
            <PopoverTrigger asChild>
              <div
                className={cn(
                  "flex-1 flex items-center justify-between pl-8 pr-2 rounded-full h-full transition-colors hover:bg-gray-100/50",
                  guestOpen ? "bg-white shadow-lg z-10" : "",
                )}
              >
                <div className="flex flex-col justify-center text-left">
                  <div className="text-xs font-extra-bold tracking-wider text-foreground mb-0.5">
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
                <div
                  className={cn(
                    "bg-[#FF385C] text-white rounded-full ml-2 hover:bg-[#E01548] flex items-center justify-center overflow-hidden shadow-md active:scale-95 transition-all duration-300 ease-out",
                    isAnyOpen ? "px-6 py-3.5 gap-2 h-12 w-auto" : "h-14 w-14",
                  )}
                >
                  <Search
                    className={cn(
                      "stroke-[3px] flex-shrink-0",
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
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              sideOffset={16}
              align="end"
              className="p-0 border-none bg-transparent shadow-none w-auto"
              avoidCollisions={false}
            >
              <GuestsSelector onCountsChange={handleGuestsChange} />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Mobile & Tablet (Popup Modal) */}
      <div className="block lg:hidden w-full px-4">
        {/* Mobile Search Trigger Capsule */}
        <button
          onClick={() => setMobileModalOpen(true)}
          className="w-full bg-white/95 backdrop-blur-md rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-white/20 p-3 pl-4 flex items-center gap-3 transition-transform active:scale-[0.98]"
        >
          <Search className="h-5 w-5 text-foreground/80 stroke-[2.5px] flex-shrink-0" />
          <div className="flex flex-col items-start flex-1 min-w-0">
            <span className="font-bold text-sm text-foreground truncate w-full text-left">
              {destination || "Where to?"}
            </span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="truncate max-w-[120px]">
                {formattedDate !== "Add dates" ? formattedDate : "Any week"}
              </span>
              <span className="flex-shrink-0">•</span>
              <span className="flex-shrink-0">
                {totalGuests > 0 ? `${totalGuests} guests` : "Add guests"}
              </span>
            </div>
          </div>
          <div className="bg-primary p-2.5 rounded-full flex-shrink-0">
            <Search className="h-4 w-4 text-white" />
          </div>
        </button>

        {/* Popup Modal */}
        {mobileModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileModalOpen(false)}
            />

            {/* Popup Content */}
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200 max-h-[85vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white shrink-0">
                <button
                  onClick={() => setMobileModalOpen(false)}
                  className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5 text-foreground" />
                </button>
                <span className="font-semibold text-base text-foreground">
                  Search
                </span>
                <button
                  onClick={handleClearAll}
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Clear
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto">
                {/* WHERE Section */}
                <div className="border-b border-gray-100">
                  <button
                    onClick={() => setMobileActiveTab("where")}
                    className={cn(
                      "w-full flex items-center justify-between p-4 text-left transition-all",
                      mobileActiveTab === "where" && "bg-gray-50",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-muted-foreground block">
                          Where
                        </span>
                        <span className="font-semibold text-base text-foreground">
                          {destination || "Search destinations"}
                        </span>
                      </div>
                    </div>
                    <svg
                      className={cn(
                        "w-5 h-5 text-muted-foreground transition-transform duration-200",
                        mobileActiveTab === "where" && "rotate-180",
                      )}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {mobileActiveTab === "where" && (
                    <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-1 duration-150">
                      <DestinationPicker
                        onSelect={(val) => {
                          handleDestinationSelect(val);
                          setMobileActiveTab("when");
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* WHEN Section */}
                <div className="border-b border-gray-100">
                  <button
                    onClick={() => setMobileActiveTab("when")}
                    className={cn(
                      "w-full flex items-center justify-between p-4 text-left transition-all",
                      mobileActiveTab === "when" && "bg-gray-50",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-muted-foreground block">
                          When
                        </span>
                        <span className="font-semibold text-base text-foreground">
                          {formattedDate !== "Add dates"
                            ? formattedDate
                            : "Add dates"}
                        </span>
                      </div>
                    </div>
                    <svg
                      className={cn(
                        "w-5 h-5 text-muted-foreground transition-transform duration-200",
                        mobileActiveTab === "when" && "rotate-180",
                      )}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {mobileActiveTab === "when" && (
                    <div className="px-2 pb-4 animate-in fade-in slide-in-from-top-1 duration-150">
                      <DatePicker
                        value={dateRange}
                        onSelect={(range, days, flex) => {
                          handleDateSelect(range, days, flex);
                        }}
                      />
                      <div className="flex justify-end mt-3 px-2">
                        <Button
                          onClick={() => setMobileActiveTab("who")}
                          variant="default"
                          size="sm"
                          className="rounded-full px-6"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* WHO Section */}
                <div>
                  <button
                    onClick={() => setMobileActiveTab("who")}
                    className={cn(
                      "w-full flex items-center justify-between p-4 text-left transition-all",
                      mobileActiveTab === "who" && "bg-gray-50",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-muted-foreground block">
                          Who
                        </span>
                        <span className="font-semibold text-base text-foreground">
                          {totalGuests > 0
                            ? `${totalGuests} guests`
                            : "Add guests"}
                        </span>
                      </div>
                    </div>
                    <svg
                      className={cn(
                        "w-5 h-5 text-muted-foreground transition-transform duration-200",
                        mobileActiveTab === "who" && "rotate-180",
                      )}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {mobileActiveTab === "who" && (
                    <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-1 duration-150">
                      <GuestsSelector onCountsChange={handleGuestsChange} />
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="shrink-0 p-4 border-t border-gray-200 bg-white">
                <button
                  onClick={() => {
                    setMobileModalOpen(false);
                    // Trigger Search
                  }}
                  className="w-full bg-gradient-to-r from-[#FF385C] to-[#E01548] text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-base shadow-lg active:scale-[0.98] transition-transform"
                >
                  <Search className="h-5 w-5 stroke-[2.5px]" />
                  Search
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
