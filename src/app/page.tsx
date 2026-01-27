import { PropertyCard } from "@/components/property/PropertyCard";
import { getProperties } from "@/actions/properties";
import { HeroBanner } from "@/components/home/HeroBanner";

export default async function Home() {
  const result = await getProperties();
  const properties = result.success ? result.data.properties : [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner with Search */}
      <HeroBanner />

      {/* Spacer for overlapping search bar */}
      <div className="h-16 md:h-20" />

      {/* Property Grid */}
      <main className="flex-1 pt-8 md:pt-12">
        <div className="w-full max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
          {/* Section Header */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Temukan Penginapan Terbaik
            </h2>
            <p className="text-muted-foreground">
              Pilihan akomodasi terpopuler untuk liburan impian Anda
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-6 gap-y-10">
            {properties.length === 0 ? (
              <div className="col-span-full h-40 flex items-center justify-center text-muted-foreground">
                No properties available.
              </div>
            ) : (
              properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))
            )}
          </div>
        </div>
      </main>

      {/* Floating Map/List Toggle Button (Visual only) */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-30">
        <button className="bg-foreground text-background hover:scale-105 transition-transform font-semibold px-5 py-3.5 rounded-full shadow-xl flex items-center gap-2 text-sm">
          <span>Show map</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            aria-hidden="true"
            role="presentation"
            focusable="false"
            style={{
              display: "block",
              height: "16px",
              width: "16px",
              fill: "currentcolor",
            }}
          >
            <path d="M31.245 3.747a2.285 2.285 0 0 0-1.01-1.44A2.286 2.286 0 0 0 28.501 2c-.672 0-1.35.212-1.929.62l-.005.003-.004.003-9.563 6.375a2.285 2.285 0 0 1-2.528 0l-.001-.001-9.559-6.377a2.285 2.285 0 0 0-3.328.736A2.287 2.287 0 0 0 1 4.5v18.5a2.286 2.286 0 0 0 1.94 2.261l.055.006c.677 0 1.36-.214 1.943-.625l9.563-6.375a2.285 2.285 0 0 1 2.528 0l9.563 6.377a2.286 2.286 0 0 0 2.148.513l.03-.007a2.287 2.287 0 0 0 1.475-2.15V4.5a2.29 2.29 0 0 0-.999-1.503zM10.499 17.584 3 22.584V4.5c0-.18.068-.354.191-.49a.286.286 0 0 1 .309-.083l.003.001c.205.143.435.22.666.22a.286.286 0 0 1 .158.048l.004.002zM17 19.333V5.589l7.499 5Zm12-3.167L21.501 21.166V9.416l7.499-4.999v11.749z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
