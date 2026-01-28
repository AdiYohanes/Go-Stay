import { Suspense } from "react";
import { PropertyCard } from "@/components/property/PropertyCard";
import { getProperties } from "@/actions/properties";
import { ParallaxHero } from "@/components/ui/ParallaxHero";
import { PropertyGrid, EmptyGridState } from "@/components/layout/PropertyGrid";
import { SearchBar } from "@/components/search/SearchBar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

// Loading component for property grid
function PropertyGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="space-y-3 animate-pulse">
          <Skeleton className="aspect-square rounded-xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

// Async component for featured properties
async function FeaturedProperties() {
  const result = await getProperties({ limit: 12 });
  const properties = result.success ? result.data.properties : [];

  if (properties.length === 0) {
    return (
      <EmptyGridState
        title="No properties available"
        description="Check back soon for amazing properties to book."
        action={
          <Button asChild>
            <Link href="/properties">Browse All Properties</Link>
          </Button>
        }
      />
    );
  }

  return (
    <>
      <PropertyGrid>
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </PropertyGrid>

      {/* View All Button */}
      <div className="mt-12 text-center">
        <Button asChild size="lg" variant="outline">
          <Link href="/properties">View All Properties</Link>
        </Button>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Parallax */}
      <ParallaxHero
        backgroundImage="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1920&auto=format&fit=crop"
        minHeight="70vh"
        parallaxStrength={0.4}
        overlayOpacity={0.5}
      >
        <div className="w-full max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-6 px-4 py-20">
          <div className="text-center text-white space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-white/90 text-sm font-medium">
                Discover Your Perfect Stay
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold drop-shadow-lg">
              Find Your Dream
              <br />
              <span className="text-sky-400">Accommodation</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-medium drop-shadow-md">
              Explore thousands of properties worldwide and book your perfect
              getaway
            </p>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-6 text-white/90 font-medium pt-4">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm drop-shadow-md">4.9 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm drop-shadow-md">
                  1000+ Destinations
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span className="text-sm drop-shadow-md">Secure Booking</span>
              </div>
            </div>
          </div>
        </div>
      </ParallaxHero>

      {/* Search Bar Section */}
      <div className="relative -mt-8 z-20">
        <div className="w-full max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-6 px-4">
          <SearchBar variant="hero" />
        </div>
      </div>

      {/* Featured Properties Section */}
      <main className="flex-1 pt-16 md:pt-20 pb-16">
        <div className="w-full max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-6 px-4">
          {/* Section Header */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Featured Properties
            </h2>
            <p className="text-muted-foreground">
              Discover our handpicked selection of exceptional accommodations
            </p>
          </div>

          {/* Property Grid */}
          <Suspense fallback={<PropertyGridSkeleton />}>
            <FeaturedProperties />
          </Suspense>
        </div>

        {/* Call to Action Section */}
        <div className="mt-20 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 py-16">
          <div className="w-full max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-6 px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of travelers who have found their perfect stay with
              us. Book now and save up to 40% on your next adventure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/properties">Explore Properties</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/register">Sign Up for Deals</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
