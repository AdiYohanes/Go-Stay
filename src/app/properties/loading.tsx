import { Skeleton } from "@/components/ui/skeleton";

export default function PropertiesLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Search Bar Skeleton */}
      <div className="sticky top-0 z-30 bg-background border-b border-border shadow-sm">
        <div className="w-full max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-6 px-4 py-4">
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-6 px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-24">
              <Skeleton className="h-96 rounded-lg" />
            </div>
          </aside>

          {/* Search Results */}
          <main className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="mb-6">
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="space-y-3 animate-pulse">
                  <Skeleton className="aspect-square rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
