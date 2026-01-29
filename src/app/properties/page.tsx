import { Suspense } from "react";
import { Metadata } from "next";
import { Skeleton } from "@/components/ui/skeleton";
import { DynamicSearchFilters } from "@/lib/dynamic-imports";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchResults } from "@/components/search/SearchResults";
import { searchProperties } from "@/actions/search";
import { SearchParams } from "@/types/search.types";

export const metadata: Metadata = {
  title: "Search Properties | Hotel Booking",
  description:
    "Find your perfect accommodation from thousands of properties worldwide. Filter by location, dates, price, and amenities.",
  openGraph: {
    title: "Search Properties | Hotel Booking",
    description:
      "Find your perfect accommodation from thousands of properties worldwide.",
    type: "website",
  },
};

interface PageProps {
  searchParams: Promise<{
    location?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
    minPrice?: string;
    maxPrice?: string;
    amenities?: string;
    page?: string;
    sortBy?: string;
  }>;
}

export default async function PropertiesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Parse search params
  const searchFilters: SearchParams = {
    location: params.location,
    checkIn: params.checkIn,
    checkOut: params.checkOut,
    guests: params.guests ? parseInt(params.guests) : undefined,
    minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
    amenities: params.amenities ? params.amenities.split(",") : undefined,
    page: params.page ? parseInt(params.page) : 1,
    sortBy: (params.sortBy as SearchParams["sortBy"]) || "relevance",
  };

  // Fetch search results
  const result = await searchProperties(searchFilters);
  const searchResult = result.success
    ? result.data
    : {
        properties: [],
        total: 0,
        page: 1,
        totalPages: 0,
        hasMore: false,
      };

  return (
    <div className="min-h-screen bg-background">
      {/* Search Bar - Compact variant */}
      <div className="sticky top-0 z-30 bg-background border-b border-border shadow-sm">
        <div className="w-full max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-6 px-4 py-4">
          <SearchBar variant="compact" initialValues={searchFilters} />
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-6 px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-24">
              <Suspense fallback={<Skeleton className="h-96 rounded-lg" />}>
                <DynamicSearchFilters initialFilters={searchFilters} />
              </Suspense>
            </div>
          </aside>

          {/* Search Results */}
          <main className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {searchFilters.location
                  ? `Properties in ${searchFilters.location}`
                  : "All Properties"}
              </h1>
              <p className="text-muted-foreground">
                {searchResult.total > 0
                  ? `${searchResult.total} ${searchResult.total === 1 ? "property" : "properties"} found`
                  : "No properties found"}
              </p>
            </div>

            {/* Mobile Filters Button */}
            <div className="lg:hidden mb-6">
              <Suspense fallback={<Skeleton className="h-12 rounded-lg" />}>
                <DynamicSearchFilters initialFilters={searchFilters} />
              </Suspense>
            </div>

            {/* Results Grid */}
            <Suspense
              fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-3 animate-pulse">
                      <div className="aspect-square rounded-xl bg-muted" />
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  ))}
                </div>
              }
            >
              <SearchResults
                searchResult={searchResult}
                currentFilters={searchFilters}
              />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
