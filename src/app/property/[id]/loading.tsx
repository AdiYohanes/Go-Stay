import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyLoading() {
  return (
    <div className="min-h-screen pb-20 md:pb-10">
      <div className="container max-w-[1280px] mx-auto px-4 py-6 md:px-6 md:py-8 lg:py-10">
        {/* Header Section */}
        <div className="mb-6">
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        {/* Gallery Skeleton */}
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] md:h-[500px] rounded-xl overflow-hidden">
          <Skeleton className="col-span-4 md:col-span-2 row-span-2" />
          <Skeleton className="col-span-2 md:col-span-1" />
          <Skeleton className="col-span-2 md:col-span-1" />
          <Skeleton className="col-span-2 md:col-span-1" />
          <Skeleton className="col-span-2 md:col-span-1" />
        </div>

        <div className="mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          {/* Main Content Column */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar / Booking Widget (Desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <Skeleton className="h-96 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
