"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DatePickerProps {
  value?: DateRange;
  onSelect?: (
    range: DateRange | undefined,
    flexDays?: number,
    flexibleMode?: { duration: string; months: string[] },
  ) => void;
}

// Generic iOS-style Wheel Picker Component
function WheelPicker({
  items,
  selectedIndex,
  onSelect,
  label,
}: {
  items: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  label?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const itemHeight = 44;
  const visibleItems = 5;

  // Scroll to selected item on mount only
  useEffect(() => {
    if (containerRef.current && !isScrollingRef.current) {
      const scrollPosition = selectedIndex * itemHeight;
      containerRef.current.scrollTop = scrollPosition;
    }
  }, []);

  const handleScrollEnd = () => {
    if (!containerRef.current) return;

    const scrollTop = containerRef.current.scrollTop;
    const newIndex = Math.round(scrollTop / itemHeight);
    const clampedIndex = Math.max(0, Math.min(items.length - 1, newIndex));

    // Snap to nearest item
    containerRef.current.scrollTo({
      top: clampedIndex * itemHeight,
      behavior: "smooth",
    });

    if (clampedIndex !== selectedIndex) {
      onSelect(clampedIndex);
    }

    isScrollingRef.current = false;
  };

  const handleScroll = () => {
    isScrollingRef.current = true;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(handleScrollEnd, 100);
  };

  const handleItemClick = (index: number) => {
    if (containerRef.current) {
      isScrollingRef.current = true;
      containerRef.current.scrollTo({
        top: index * itemHeight,
        behavior: "smooth",
      });
      setTimeout(() => {
        onSelect(index);
        isScrollingRef.current = false;
      }, 300);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative flex-1">
      {label && (
        <div className="text-center mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {label}
          </span>
        </div>
      )}
      <div className="relative">
        {/* Gradient overlays for fade effect */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent z-10 pointer-events-none" />

        {/* Selection indicator */}
        <div className="absolute top-1/2 left-2 right-2 -translate-y-1/2 h-11 bg-gray-100 rounded-xl z-0 pointer-events-none" />

        {/* Scrollable container */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="relative h-[220px] overflow-y-auto scrollbar-hide"
          style={{
            WebkitOverflowScrolling: "touch",
            paddingTop: `${((visibleItems - 1) / 2) * itemHeight}px`,
            paddingBottom: `${((visibleItems - 1) / 2) * itemHeight}px`,
          }}
        >
          {items.map((item, index) => {
            const isSelected = index === selectedIndex;
            return (
              <div
                key={item}
                onClick={() => handleItemClick(index)}
                className={cn(
                  "h-11 flex items-center justify-center cursor-pointer transition-all duration-150",
                  isSelected
                    ? "text-black font-semibold text-lg"
                    : "text-gray-400 font-medium text-base hover:text-gray-600",
                )}
              >
                {item}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function DatePicker({ value, onSelect }: DatePickerProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("dates");
  const [date, setDate] = useState<DateRange | undefined>(value);
  const [flexDays, setFlexDays] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [monthDuration, setMonthDuration] = useState(1); // Duration in months (1-12)

  // Flexible mode state
  const [flexibleDuration, setFlexibleDuration] = useState("Minggu");
  const [flexibleMonths, setFlexibleMonths] = useState<string[]>([]);

  // Initialize date-dependent state only on client
  useEffect(() => {
    setMounted(true);
    if (!value) {
      setDate({ from: new Date(), to: undefined });
    }
    setSelectedMonth(new Date().getMonth());
  }, []);

  useEffect(() => {
    if (value) {
      setDate(value);
    }
  }, [value]);

  const handleSelect = (range: DateRange | undefined) => {
    setDate(range);
    setFlexDays(0);
    onSelect?.(range, 0);
  };

  const handleShortcut = (days: number) => {
    const baseDate = date?.from || new Date();
    const newDate = {
      from: baseDate,
      to: baseDate,
    };
    setDate(newDate);
    setFlexDays(days);
    onSelect?.(newDate, days);
  };

  // Helper to calculate month date range
  const calculateMonthRange = (monthIndex: number, duration: number) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Calculate the actual year for the selected month
    let year = currentYear;
    if (monthIndex < currentMonth) {
      year = currentYear + 1;
    }

    const startOfMonth = new Date(year, monthIndex, 1);
    const endMonth = new Date(year, monthIndex + duration, 1);
    return { from: startOfMonth, to: endMonth };
  };

  const handleMonthSelect = (monthIndex: number) => {
    setSelectedMonth(monthIndex);
    const newRange = calculateMonthRange(monthIndex, monthDuration);
    setDate(newRange);
    onSelect?.(newRange, 0);
  };

  const handleDurationChange = (duration: number) => {
    setMonthDuration(duration);
    const newRange = calculateMonthRange(selectedMonth, duration);
    setDate(newRange);
    onSelect?.(newRange, 0);
  };

  // Handler for flexible mode updates
  const handleFlexibleUpdate = (duration: string, months: string[]) => {
    setFlexibleDuration(duration);
    setFlexibleMonths(months);
    // For flexible mode, we pass undefined date but with flexible info
    onSelect?.(undefined, 0, { duration, months });
  };

  const isExactDays = (days: number) => {
    return flexDays === days;
  };

  // Create today date only when mounted
  const today = mounted ? new Date() : new Date(0);
  if (mounted) {
    today.setHours(0, 0, 0, 0);
  }

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  // Prevent hydration mismatch by not rendering date-dependent content until mounted
  if (!mounted) {
    return (
      <div className="bg-white rounded-none md:rounded-[2rem] shadow-none md:shadow-xl border-0 md:border border-border/10 p-2 md:p-6 w-full max-w-[850px] flex flex-col items-center min-h-[300px]">
        <div className="bg-gray-100 rounded-full inline-flex p-1 mb-4 md:mb-8 w-full md:w-auto">
          <div className="flex bg-transparent h-auto p-0 gap-0 w-full md:w-auto">
            <div className="flex-1 md:flex-none rounded-full px-3 md:px-6 py-1.5 md:py-2.5 text-xs md:text-sm font-medium text-gray-500 bg-white shadow">
              Tanggal
            </div>
            <div className="flex-1 md:flex-none rounded-full px-3 md:px-6 py-1.5 md:py-2.5 text-xs md:text-sm font-medium text-gray-500">
              Bulan
            </div>
            <div className="flex-1 md:flex-none rounded-full px-3 md:px-6 py-1.5 md:py-2.5 text-xs md:text-sm font-medium text-gray-500">
              Fleksibel
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-none md:rounded-[2rem] shadow-none md:shadow-xl border-0 md:border border-border/10 p-2 md:p-6 w-full max-w-[850px] flex flex-col items-center">
      {/* Top Tabs - Professional Centered Pills */}
      <div className="bg-gray-100 rounded-full inline-flex p-1 mb-4 md:mb-8 w-full md:w-auto">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full md:w-auto"
        >
          <TabsList className="flex bg-transparent h-auto p-0 gap-0 w-full md:w-auto">
            <TabsTrigger
              value="dates"
              className="flex-1 md:flex-none rounded-full px-3 md:px-6 py-1.5 md:py-2.5 text-xs md:text-sm font-medium text-gray-500 transition-all hover:text-gray-900 select-none outline-none focus-visible:ring-0 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:shadow"
            >
              Tanggal
            </TabsTrigger>
            <TabsTrigger
              value="months"
              className="flex-1 md:flex-none rounded-full px-3 md:px-6 py-1.5 md:py-2.5 text-xs md:text-sm font-medium text-gray-500 transition-all hover:text-gray-900 select-none outline-none focus-visible:ring-0 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:shadow"
            >
              Bulan
            </TabsTrigger>
            <TabsTrigger
              value="flexible"
              className="flex-1 md:flex-none rounded-full px-3 md:px-6 py-1.5 md:py-2.5 text-xs md:text-sm font-medium text-gray-500 transition-all hover:text-gray-900 select-none outline-none focus-visible:ring-0 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:shadow"
            >
              Fleksibel
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content based on active tab */}
      {activeTab === "dates" && (
        <>
          {/* Calendar */}
          <div className="w-full relative mb-4">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleSelect}
              numberOfMonths={2}
              disabled={{ before: today }}
              fromDate={today}
              className="p-0 w-full hidden md:flex justify-center"
              classNames={{
                months:
                  "flex flex-col md:flex-row space-y-4 md:space-x-12 md:space-y-0 relative w-full justify-center",
                month: "space-y-6 w-full md:w-auto",
                caption: "flex justify-center pt-1 items-center mb-6 relative",
                caption_label: "text-lg font-bold text-gray-800",
                nav: "space-x-1 flex items-center absolute w-full top-0 left-0 h-10 z-20",
                button_previous:
                  "absolute left-0 md:-left-2 top-0 h-9 w-9 bg-white p-0 hover:bg-gray-100 rounded-full transition-colors border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 cursor-pointer z-50",
                button_next:
                  "absolute right-0 md:-right-2 top-0 h-9 w-9 bg-white p-0 hover:bg-gray-100 rounded-full transition-colors border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 cursor-pointer z-50",
                table: "w-full border-collapse space-y-1 mx-auto",
                head_row: "flex w-full mt-4 mb-4 justify-between",
                head_cell:
                  "text-gray-500 rounded-md w-10 font-medium text-xs uppercase tracking-wide",
                row: "flex w-full mt-2 justify-between",
                cell: "h-11 w-11 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-full [&:has([aria-selected].day-outside)]:bg-gray-100/50 [&:has([aria-selected])]:bg-gray-100 first:[&:has([aria-selected])]:rounded-l-full last:[&:has([aria-selected])]:rounded-r-full focus-within:relative focus-within:z-20 cursor-pointer",
                day: "h-11 w-11 p-0 font-semibold text-gray-700 hover:bg-gray-200 hover:rounded-full rounded-full transition-all focus:bg-black focus:text-white focus:rounded-full aria-selected:opacity-100 cursor-pointer",
                day_range_end: "day-range-end cursor-pointer",
                day_selected:
                  "bg-black text-white hover:bg-black hover:text-white focus:bg-black focus:text-white rounded-full transition-transform active:scale-95 cursor-pointer",
                day_today:
                  "after:content-[''] after:absolute after:bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-black after:rounded-full",
                day_outside: "text-gray-300 opacity-50",
                day_disabled: "text-gray-300 opacity-50",
                day_range_middle:
                  "aria-selected:bg-gray-100 aria-selected:text-black rounded-none cursor-pointer",
                day_hidden: "invisible",
              }}
            />

            {/* Mobile Calendar */}
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleSelect}
              numberOfMonths={1}
              disabled={{ before: today }}
              fromDate={today}
              className="p-0 w-full flex md:hidden justify-center"
              classNames={{
                months: "flex flex-col space-y-4 w-full",
                month: "space-y-4 w-full",
                caption: "flex justify-center pt-1 relative items-center mb-6",
                caption_label: "text-lg font-bold text-gray-800",
                nav: "space-x-1 flex items-center absolute w-full top-0 left-0 h-10 z-20",
                button_previous:
                  "absolute left-0 h-9 w-9 bg-white p-0 hover:bg-gray-100 rounded-full transition-colors border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 cursor-pointer z-50",
                button_next:
                  "absolute right-0 h-9 w-9 bg-white p-0 hover:bg-gray-100 rounded-full transition-colors border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 cursor-pointer z-50",
                table: "w-full border-collapse",
                head_row: "flex w-full mt-4 mb-3 justify-between px-1",
                head_cell:
                  "text-gray-500 rounded-md w-10 font-medium text-xs uppercase tracking-wide text-center",
                row: "flex w-full mt-1 justify-between px-1",
                cell: "h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-full [&:has([aria-selected].day-outside)]:bg-gray-100/50 [&:has([aria-selected])]:bg-gray-100 first:[&:has([aria-selected])]:rounded-l-full last:[&:has([aria-selected])]:rounded-r-full focus-within:relative focus-within:z-20 cursor-pointer",
                day: "h-10 w-10 p-0 font-semibold text-gray-700 hover:bg-gray-200 hover:rounded-full rounded-full transition-all focus:bg-black focus:text-white focus:rounded-full aria-selected:opacity-100 cursor-pointer",
                day_range_end: "day-range-end cursor-pointer",
                day_selected:
                  "bg-black text-white hover:bg-black hover:text-white focus:bg-black focus:text-white rounded-full transition-transform active:scale-95 cursor-pointer",
                day_today:
                  "after:content-[''] after:absolute after:bottom-1.5 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-black after:rounded-full",
                day_outside: "text-gray-300 opacity-50",
                day_disabled: "text-gray-300 opacity-50",
                day_range_middle:
                  "aria-selected:bg-gray-100 aria-selected:text-black rounded-none cursor-pointer",
                day_hidden: "invisible",
              }}
            />
          </div>

          {/* Quick Selection Shortcuts */}
          <div className="flex flex-wrap gap-2 md:gap-3 w-full justify-start md:justify-center mt-2 px-2 pb-2">
            <button
              onClick={() => handleShortcut(0)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium border transition-all text-nowrap cursor-pointer",
                isExactDays(0)
                  ? "border-black bg-black text-white"
                  : "border-gray-200 hover:border-black bg-white",
              )}
            >
              Tanggal pasti
            </button>
            {[1, 2, 3, 7, 14].map((days) => (
              <button
                key={days}
                onClick={() => handleShortcut(days)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium border transition-all text-nowrap cursor-pointer",
                  isExactDays(days)
                    ? "border-black bg-black text-white"
                    : "border-gray-200 hover:border-black bg-white text-gray-600",
                )}
              >
                ± {days} hari
              </button>
            ))}
          </div>
        </>
      )}

      {activeTab === "months" && (
        <div className="w-full py-2 md:py-4">
          {/* Title */}
          <div className="text-center mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1">
              Pilih Periode Menginap
            </h3>
            <p className="text-xs md:text-sm text-gray-500">
              Geser untuk memilih bulan dan durasi
            </p>
          </div>

          {/* Dual Wheel Pickers - Side by Side */}
          <div className="flex gap-2 md:gap-4 max-w-[500px] mx-auto px-2 md:px-4">
            <WheelPicker
              label="Mulai Bulan"
              items={months}
              selectedIndex={selectedMonth}
              onSelect={handleMonthSelect}
            />
            <WheelPicker
              label="Durasi"
              items={[
                "1 bulan",
                "2 bulan",
                "3 bulan",
                "4 bulan",
                "5 bulan",
                "6 bulan",
                "7 bulan",
                "8 bulan",
                "9 bulan",
                "10 bulan",
                "11 bulan",
                "12 bulan",
              ]}
              selectedIndex={monthDuration - 1}
              onSelect={(index) => handleDurationChange(index + 1)}
            />
          </div>

          {/* Selected range display */}
          <div className="mt-6 md:mt-8 text-center px-2">
            <div className="inline-flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-gray-100 rounded-full">
              <span className="text-gray-500 text-xs md:text-sm">Periode:</span>
              <span className="font-semibold text-black text-xs md:text-sm">
                {date?.from && date?.to
                  ? date.from.getFullYear() !== date.to.getFullYear()
                    ? `1 ${months[selectedMonth]} ${date.from.getFullYear()} – 1 ${months[(selectedMonth + monthDuration) % 12]} ${date.to.getFullYear()}`
                    : `1 ${months[selectedMonth]} – 1 ${months[(selectedMonth + monthDuration) % 12]} ${date.from.getFullYear()}`
                  : `${months[selectedMonth]}`}
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "flexible" && (
        <FlexiblePicker onUpdate={handleFlexibleUpdate} />
      )}
    </div>
  );
}

// Flexible Travel Picker Component
function FlexiblePicker({
  onUpdate,
}: {
  onUpdate: (duration: string, months: string[]) => void;
}) {
  const [selectedDuration, setSelectedDuration] = useState("Minggu");
  const [selectedMonthIndices, setSelectedMonthIndices] = useState<number[]>(
    [],
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [upcomingMonths, setUpcomingMonths] = useState<
    { month: number; year: number; label: string }[]
  >([]);

  const durations = ["Akhir pekan", "Minggu", "Bulan"];

  // Generate next 12 months starting from current month - only on client
  useEffect(() => {
    const months = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
      months.push({
        month: date.getMonth(),
        year: date.getFullYear(),
        label: date.toLocaleDateString("id-ID", { month: "long" }),
      });
    }
    setUpcomingMonths(months);
  }, []);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollTo = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleDurationSelect = (duration: string) => {
    setSelectedDuration(duration);
    const monthLabels = selectedMonthIndices.map(
      (i) => `${upcomingMonths[i].label} ${upcomingMonths[i].year}`,
    );
    onUpdate(duration, monthLabels);
  };

  const toggleMonth = (index: number) => {
    const newSelection = selectedMonthIndices.includes(index)
      ? selectedMonthIndices.filter((m) => m !== index)
      : [...selectedMonthIndices, index];

    setSelectedMonthIndices(newSelection);
    const monthLabels = newSelection.map(
      (i) => `${upcomingMonths[i].label} ${upcomingMonths[i].year}`,
    );
    onUpdate(selectedDuration, monthLabels);
  };

  return (
    <div className="w-full py-2 md:py-4">
      {/* Duration Question */}
      <div className="text-center mb-4 md:mb-6">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">
          Berapa lama Anda ingin menginap?
        </h3>

        {/* Duration Pills */}
        <div className="inline-flex gap-1.5 md:gap-2 justify-center flex-wrap px-2">
          {durations.map((duration) => (
            <button
              key={duration}
              onClick={() => handleDurationSelect(duration)}
              className={cn(
                "px-3 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-medium border transition-all cursor-pointer",
                selectedDuration === duration
                  ? "border-black bg-black text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-500",
              )}
            >
              {duration}
            </button>
          ))}
        </div>
      </div>

      {/* Month Selection */}
      <div className="mt-6 md:mt-8">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 text-center">
          Kapan Anda ingin pergi?
        </h3>

        {/* Month Cards Carousel */}
        <div className="relative">
          {/* Left Arrow - Hidden on mobile */}
          {canScrollLeft && (
            <button
              onClick={() => scrollTo("left")}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
          )}

          {/* Right Arrow - Hidden on mobile */}
          {canScrollRight && (
            <button
              onClick={() => scrollTo("right")}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide px-3 md:px-6 py-2"
            style={{ scrollBehavior: "smooth" }}
          >
            {upcomingMonths.map((monthData, index) => (
              <button
                key={`${monthData.month}-${monthData.year}`}
                onClick={() => toggleMonth(index)}
                className={cn(
                  "flex-shrink-0 w-20 md:w-24 h-24 md:h-28 rounded-xl md:rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 md:gap-2 transition-all cursor-pointer hover:border-gray-400",
                  selectedMonthIndices.includes(index)
                    ? "border-black bg-gray-50"
                    : "border-gray-200 bg-white",
                )}
              >
                {/* Calendar Icon */}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-600 w-5 h-5 md:w-7 md:h-7"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>

                {/* Month Name */}
                <span className="text-xs md:text-sm font-semibold text-gray-800">
                  {monthData.label}
                </span>

                {/* Year */}
                <span className="text-[10px] md:text-xs text-gray-500">
                  {monthData.year}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | undefined | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}
