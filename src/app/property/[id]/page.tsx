import { notFound } from 'next/navigation'
import { MapPin, Users, Star } from 'lucide-react'
import { MOCK_PROPERTIES } from '@/lib/mock-data'
import { PropertyGallery } from '@/components/property/PropertyGallery'
import { AmenitiesList } from '@/components/property/AmenitiesList'
import { BookingWidget } from '@/components/booking/BookingWidget'

// Simulate data fetching
async function getProperty(id: string) {
  // In real app: supabase.from('properties').select('*').eq('id', id).single()
  return MOCK_PROPERTIES.find((p) => p.id === id) || null
}

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  // Await params for Next.js 15+
  const { id } = await params
  const property = await getProperty(id)

  if (!property) {
    notFound()
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">{property.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground text-sm">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{property.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{property.max_guests} guests</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span>4.8 (24 reviews)</span>
              </div>
            </div>
          </div>

          <PropertyGallery images={property.image_urls || []} />

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">About this place</h2>
            <p className="text-muted-foreground leading-relaxed">
              {property.description}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Amenities</h2>
            <AmenitiesList amenities={property.amenities || []} />
          </div>
        </div>

        {/* Sidebar / Booking Widget */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <BookingWidget property={property} />
          </div>
        </div>
      </div>
    </div>
  )
}
