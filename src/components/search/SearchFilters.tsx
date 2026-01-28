"use client";

import React from "react";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { SearchParams, SortOption } from "@/types/search.types";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface SearchFiltersProps {
  initialFilters?: Partial<SearchParams>;
}

const COMMON_AMENITIES = [
  "WiFi",
  "Kitchen",
  "Parking",
  "Air conditioning",
  "Heating",
  "TV",
  "Washer",
  "Dryer",
  "Pool",
  "Hot tub",
  "Gym",
  "Workspace",
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
];

function PriceRangeSlider({
  value,
  onChange,
}: {
  value: [number, number];
  onChange: (value: [number, number]) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Price Range</span>
        <span className="text-sm text-muted-foreground">
          ${value[0]} - ${value[1]}
        </span>
      </div>
      <Slider
        min={0}
        max={1000}
        step={10}
        value={value}
        onValueChange={(val: number[]) => onChange(val as [number, number])}
        className="w-full"
      />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>$0</span>
        <span>$1000+</span>
      </div>
    </div>
  );
}

function AmenitiesCheckboxes({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (amenities: string[]) => void;
}) {
  const toggleAmenity = (amenity: string) => {
    if (selected.includes(amenity)) {
      onChange(selected.filter((a) => a !== amenity));
    } else {
      onChange([...selected, amenity]);
    }
  };

  return (
    <div className="space-y-3">
      <span className="text-sm font-medium">Amenities</span>
      <div className="grid grid-cols-2 gap-3">
        {COMMON_AMENITIES.map((amenity) => (
          <div key={amenity} className="flex items-center space-x-2">
            <Checkbox
              id={amenity}
              checked={selected.includes(amenity)}
              onCheckedChange={() => toggleAmenity(amenity)}
            />
            <Label
              htmlFor={amenity}
              className="text-sm font-normal cursor-pointer"
            >
              {amenity}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SearchFilters({ initialFilters = {} }: SearchFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [localFilters, setLocalFilters] = React.useState(initialFilters);
  const [isOpen, setIsOpen] = React.useState(false);

  const priceRange: [number, number] = [
    localFilters.minPrice ?? 0,
    localFilters.maxPrice ?? 1000,
  ];

  const updateURL = (filters: Partial<SearchParams>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update or remove parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        params.delete(key);
      } else if (Array.isArray(value)) {
        if (value.length > 0) {
          params.set(key, value.join(","));
        } else {
          params.delete(key);
        }
      } else {
        params.set(key, String(value));
      }
    });

    // Reset to page 1 when filters change
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePriceChange = (value: [number, number]) => {
    setLocalFilters({
      ...localFilters,
      minPrice: value[0],
      maxPrice: value[1],
    });
  };

  const handleAmenitiesChange = (amenities: string[]) => {
    setLocalFilters({
      ...localFilters,
      amenities,
    });
  };

  const handleSortChange = (sortBy: SortOption) => {
    const newFilters = {
      ...localFilters,
      sortBy,
    };
    setLocalFilters(newFilters);
    updateURL(newFilters);
  };

  const handleApply = () => {
    updateURL(localFilters);
    setIsOpen(false);
  };

  const handleClear = () => {
    const clearedFilters: Partial<SearchParams> = {
      minPrice: undefined,
      maxPrice: undefined,
      amenities: undefined,
      sortBy: "relevance" as SortOption,
    };
    setLocalFilters(clearedFilters);
    updateURL(clearedFilters);
  };

  const activeFilterCount = [
    localFilters.minPrice !== undefined && localFilters.minPrice > 0,
    localFilters.maxPrice !== undefined && localFilters.maxPrice < 1000,
    localFilters.amenities && localFilters.amenities.length > 0,
  ].filter(Boolean).length;

  return (
    <div className="flex items-center gap-3">
      {/* Sort Dropdown - Desktop */}
      <div className="hidden md:block">
        <Select
          value={localFilters.sortBy || "relevance"}
          onValueChange={(value) => handleSortChange(value as SortOption)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filters Button - Opens Sheet on Mobile */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "gap-2 relative",
              activeFilterCount > 0 && "border-primary",
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>

          <div className="py-6 space-y-6">
            {/* Sort - Mobile Only */}
            <div className="md:hidden space-y-3">
              <span className="text-sm font-medium">Sort by</span>
              <Select
                value={localFilters.sortBy || "relevance"}
                onValueChange={(value) => handleSortChange(value as SortOption)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <PriceRangeSlider value={priceRange} onChange={handlePriceChange} />

            {/* Amenities */}
            <AmenitiesCheckboxes
              selected={localFilters.amenities || []}
              onChange={handleAmenitiesChange}
            />
          </div>

          <SheetFooter className="flex-row gap-2 sm:gap-2">
            <Button variant="outline" onClick={handleClear} className="flex-1">
              Clear all
            </Button>
            <Button onClick={handleApply} className="flex-1">
              Show results
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
