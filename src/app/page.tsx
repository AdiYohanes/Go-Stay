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

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white">
        <div className="w-full max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-6 px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Go-Stay
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Platform booking resort dan villa terbaik di Bali. Temukan
                pengalaman liburan mewah dengan harga terbaik.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-teal-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-teal-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-teal-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Destinasi */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Destinasi Populer</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Seminyak
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Ubud
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Uluwatu
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Canggu
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Nusa Dua
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Sanur
                  </a>
                </li>
              </ul>
            </div>

            {/* Layanan */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Layanan</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Resort & Villa
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Honeymoon Package
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Family Vacation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Corporate Retreat
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Long Stay Deals
                  </a>
                </li>
              </ul>
            </div>

            {/* Bantuan */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Bantuan</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Pusat Bantuan
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Cara Booking
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Kebijakan Pembatalan
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Hubungi Kami
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm">
                © 2025 Go-Stay. All rights reserved.
              </p>
              <div className="flex gap-6 text-gray-500 text-sm">
                <a href="#" className="hover:text-teal-400 transition-colors">
                  Syarat & Ketentuan
                </a>
                <a href="#" className="hover:text-teal-400 transition-colors">
                  Kebijakan Privasi
                </a>
                <a href="#" className="hover:text-teal-400 transition-colors">
                  Sitemap
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
