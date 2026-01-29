import { Suspense } from "react";
import { PropertyCard } from "@/components/property/PropertyCard";
import { getProperties } from "@/actions/properties";
import { ParallaxHero } from "@/components/ui/ParallaxHero";
import { PropertyGrid, EmptyGridState } from "@/components/layout/PropertyGrid";
import { SearchBar } from "@/components/search/SearchBar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Loading component for property grid
function PropertyGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 gap-y-8">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="space-y-3 animate-pulse">
          <div className="aspect-[4/3] rounded-xl bg-muted" />
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="h-4 w-3/4 rounded-md bg-muted" />
              <div className="h-4 w-10 rounded-md bg-muted" />
            </div>
            <div className="h-3.5 w-1/2 rounded-md bg-muted" />
            <div className="h-3.5 w-2/3 rounded-md bg-muted" />
            <div className="h-4 w-24 rounded-md bg-muted" />
          </div>
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
        title="Belum ada properti tersedia"
        description="Silakan cek kembali nanti untuk properti menarik yang bisa dipesan."
        action={
          <Button asChild>
            <Link href="/properties">Lihat Semua Properti</Link>
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
          <Link href="/properties">Lihat Semua Resort</Link>
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
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-white/90 text-sm font-medium">
                🌴 Temukan Resort Impian di Bali
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold drop-shadow-lg">
              Liburan Mewah
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                di Pulau Dewata
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-medium drop-shadow-md">
              Jelajahi resort dan villa terbaik di Bali. Dari tebing Uluwatu
              hingga sawah Ubud.
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
                <span className="text-sm drop-shadow-md">Rating 4.9</span>
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
                  12 Destinasi Bali
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
                <span className="text-sm drop-shadow-md">Booking Aman</span>
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
              Resort Pilihan di Bali
            </h2>
            <p className="text-muted-foreground">
              Koleksi resort dan villa terbaik yang kami rekomendasikan untuk
              liburan Anda
            </p>
          </div>

          {/* Property Grid */}
          <Suspense fallback={<PropertyGridSkeleton />}>
            <FeaturedProperties />
          </Suspense>
        </div>

        {/* Call to Action Section - Redesigned */}
        <div className="mt-20 relative overflow-hidden rounded-3xl">
          {/* Background with overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-600/95 via-cyan-600/90 to-blue-600/95" />

          {/* Content */}
          <div className="relative w-full max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-6 px-4 py-20 md:py-24">
            <div className="max-w-4xl mx-auto text-center text-white">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <span className="text-2xl">🌊</span>
                <span className="text-sm font-semibold">
                  Penawaran Terbatas
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Siap Memulai Petualangan
                <br />
                <span className="text-cyan-200">Liburan Impian Anda?</span>
              </h2>

              {/* Description */}
              <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                Bergabung dengan{" "}
                <span className="font-bold text-cyan-200">10,000+</span>{" "}
                wisatawan yang telah menemukan resort sempurna di Bali. Dapatkan{" "}
                <span className="font-bold text-cyan-200">
                  diskon hingga 40%
                </span>{" "}
                untuk pemesanan hari ini!
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 md:gap-8 mb-10 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-cyan-200 mb-1">
                    12+
                  </div>
                  <div className="text-sm md:text-base text-white/80">
                    Resort Premium
                  </div>
                </div>
                <div className="text-center border-x border-white/20">
                  <div className="text-3xl md:text-4xl font-bold text-cyan-200 mb-1">
                    4.9
                  </div>
                  <div className="text-sm md:text-base text-white/80">
                    Rating Rata-rata
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-cyan-200 mb-1">
                    24/7
                  </div>
                  <div className="text-sm md:text-base text-white/80">
                    Customer Support
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-teal-600 hover:bg-cyan-50 font-bold text-base px-8 py-6 h-auto shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                >
                  <Link href="/properties" className="flex items-center gap-2">
                    <span>🏖️</span>
                    Jelajahi Resort Sekarang
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-teal-600 font-semibold text-base px-8 py-6 h-auto backdrop-blur-sm bg-white/10"
                >
                  <Link href="/register" className="flex items-center gap-2">
                    <span>🎁</span>
                    Daftar & Dapatkan Promo
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-cyan-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Pembayaran Aman</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-cyan-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Gratis Pembatalan</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-cyan-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Konfirmasi Instan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-cyan-300/20 rounded-full blur-2xl" />
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-300/20 rounded-full blur-3xl" />
        </div>
      </main>
    </div>
  );
}
