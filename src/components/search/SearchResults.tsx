"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchResult, SearchParams } from "@/types/search.types";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface SearchResultsProps {
  searchResult: SearchResult;
  currentFilters: SearchParams;
}

function PropertyCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="w-full aspect-4/3 rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <Search className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-2xl font-bold mb-2">No properties found</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        We couldn&apos;t find any properties matching your search criteria. Try
        adjusting your filters or search in a different location.
      </p>
      <div className="space-y-2 text-sm text-muted-foreground">
        <p className="font-medium">Suggestions:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Try different dates or be more flexible with your travel dates
          </li>
          <li>Remove some filters to see more results</li>
          <li>Search for a nearby city or region</li>
          <li>Adjust your price range</li>
        </ul>
      </div>
    </motion.div>
  );
}

function PaginationControls({
  currentPage,
  totalPages,
  hasMore,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {startPage > 1 && (
        <>
          <Button
            variant="outline"
            onClick={() => onPageChange(1)}
            className="w-10 h-10"
          >
            1
          </Button>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {pages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          onClick={() => onPageChange(page)}
          className="w-10 h-10"
        >
          {page}
        </Button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <Button
            variant="outline"
            onClick={() => onPageChange(totalPages)}
            className="w-10 h-10"
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasMore}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function SearchResults({
  searchResult,
  currentFilters,
}: SearchResultsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  // Empty state
  if (!searchResult || searchResult.properties.length === 0) {
    return <EmptyState />;
  }

  const checkIn = currentFilters.checkIn
    ? new Date(currentFilters.checkIn)
    : null;
  const checkOut = currentFilters.checkOut
    ? new Date(currentFilters.checkOut)
    : null;

  // Results with staggered animations
  return (
    <div>
      {/* Property grid with staggered animations */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
      >
        <AnimatePresence mode="popLayout">
          {searchResult.properties.map((property) => (
            <motion.div
              key={property.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.4,
                    ease: "easeOut",
                  },
                },
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                transition: { duration: 0.2 },
              }}
              layout
            >
              <PropertyCard property={property} showRating={true} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Pagination controls */}
      <PaginationControls
        currentPage={searchResult.page}
        totalPages={searchResult.totalPages}
        hasMore={searchResult.hasMore}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
