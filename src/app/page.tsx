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

        {/* Why Choose Us Section */}
        <div className="mt-24 bg-gray-50 py-20">
          <div className="w-full max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-6 px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Kenapa Memilih Go-Stay?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Kami berkomitmen memberikan pengalaman booking terbaik untuk
                liburan impian Anda
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-teal-100 flex items-center justify-center mb-4">
                  <svg
                    className="w-7 h-7 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Booking Aman
                </h3>
                <p className="text-sm text-gray-600">
                  Pembayaran terenkripsi dan data Anda terlindungi dengan
                  standar keamanan tertinggi
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                  <svg
                    className="w-7 h-7 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Harga Terbaik
                </h3>
                <p className="text-sm text-gray-600">
                  Jaminan harga terbaik dengan penawaran eksklusif dan diskon
                  hingga 40%
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                  <svg
                    className="w-7 h-7 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Support 24/7
                </h3>
                <p className="text-sm text-gray-600">
                  Tim customer service siap membantu Anda kapan saja, di mana
                  saja
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center mb-4">
                  <svg
                    className="w-7 h-7 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Resort Terkurasi
                </h3>
                <p className="text-sm text-gray-600">
                  Setiap properti telah diverifikasi dan dikurasi untuk kualitas
                  terbaik
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Destinations Section */}
        <div className="mt-24">
          <div className="w-full max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-6 px-4">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Destinasi Populer
                </h2>
                <p className="text-gray-600">
                  Jelajahi lokasi favorit wisatawan di Bali
                </p>
              </div>
              <Link
                href="/properties"
                className="hidden md:flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
              >
                Lihat Semua
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                {
                  name: "Seminyak",
                  image:
                    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80",
                  count: "120+ Resort",
                },
                {
                  name: "Ubud",
                  image:
                    "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=400&q=80",
                  count: "85+ Resort",
                },
                {
                  name: "Uluwatu",
                  image:
                    "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=400&q=80",
                  count: "65+ Resort",
                },
                {
                  name: "Canggu",
                  image:
                    "https://images.unsplash.com/photo-1573790387438-4da905039392?auto=format&fit=crop&w=400&q=80",
                  count: "90+ Resort",
                },
                {
                  name: "Nusa Dua",
                  image:
                    "https://images.unsplash.com/photo-1559628233-100c798642d4?auto=format&fit=crop&w=400&q=80",
                  count: "75+ Resort",
                },
                {
                  name: "Sanur",
                  image:
                    "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=400&q=80",
                  count: "50+ Resort",
                },
              ].map((dest) => (
                <Link
                  key={dest.name}
                  href={`/properties?location=${dest.name.toLowerCase()}`}
                  className="group relative aspect-[3/4] rounded-2xl overflow-hidden"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url('${dest.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-semibold text-lg">{dest.name}</h3>
                    <p className="text-sm text-white/80">{dest.count}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-24 bg-gradient-to-br from-teal-50 to-cyan-50 py-20">
          <div className="w-full max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-6 px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Apa Kata Mereka?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Pengalaman nyata dari wisatawan yang telah menikmati liburan
                bersama Go-Stay
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "Sarah Wijaya",
                  location: "Jakarta",
                  avatar: "S",
                  rating: 5,
                  text: "Pengalaman booking yang sangat mudah! Resort yang kami dapat sangat sesuai dengan foto dan deskripsi. Pasti akan pakai Go-Stay lagi.",
                },
                {
                  name: "Budi Santoso",
                  location: "Surabaya",
                  avatar: "B",
                  rating: 5,
                  text: "Harga yang ditawarkan sangat kompetitif. Customer service juga sangat responsif saat kami butuh bantuan. Recommended!",
                },
                {
                  name: "Amanda Chen",
                  location: "Bandung",
                  avatar: "A",
                  rating: 5,
                  text: "Villa di Ubud yang kami booking benar-benar amazing! View sawah yang indah dan fasilitas lengkap. Terima kasih Go-Stay!",
                },
              ].map((testimonial, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    &quot;{testimonial.text}&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action Section - Modern Split Design */}
        <div className="mt-24 relative overflow-hidden">
          <div className="grid lg:grid-cols-2 min-h-[500px]">
            {/* Left Side - Image */}
            <div className="relative h-64 lg:h-auto">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80')",
                }}
              />
              {/* Subtle overlay for better contrast */}
              <div className="absolute inset-0 bg-black/20" />

              {/* Floating Stats Card */}
              <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 lg:right-auto">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl max-w-xs">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-teal-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        4.9
                      </div>
                      <div className="text-sm text-gray-500">
                        Rating Rata-rata
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Dari 10,000+ ulasan
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="bg-gray-50 p-8 lg:p-16 flex flex-col justify-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-full w-fit mb-6">
                <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Penawaran Terbatas</span>
              </div>

              {/* Heading */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Temukan Resort
                <br />
                <span className="text-teal-600">Impian Anda</span>
              </h2>

              {/* Description */}
              <p className="text-gray-600 text-lg mb-8 leading-relaxed max-w-lg">
                Nikmati pengalaman liburan tak terlupakan di Bali dengan koleksi
                resort dan villa premium kami. Dapatkan diskon hingga 40% untuk
                pemesanan hari ini.
              </p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 text-teal-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">Pembayaran Aman</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 text-teal-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">
                    Gratis Pembatalan
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 text-teal-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">
                    Konfirmasi Instan
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 text-teal-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">Support 24/7</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all"
                >
                  <Link href="/properties" className="flex items-center gap-2">
                    Jelajahi Resort
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold px-8 py-6 h-auto"
                >
                  <Link href="/register">Daftar Gratis</Link>
                </Button>
              </div>
            </div>
          </div>
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
