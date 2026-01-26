import { notFound } from 'next/navigation'
import { MapPin, Users, Star, Shield, Medal, Globe } from 'lucide-react'
import { PropertyGallery } from '@/components/property/PropertyGallery'
import { AmenitiesList } from '@/components/property/AmenitiesList'
import { BookingWidget } from '@/components/booking/BookingWidget'
import { MobileBookingFooter } from '@/components/booking/MobileBookingFooter'
import { PropertyMap } from '@/components/property/PropertyMap'
import { getPropertyById } from '@/actions/properties'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const property = await getPropertyById(id)

  if (!property) {
    notFound()
  }

  return (
    <div className="min-h-screen pb-20 md:pb-10">
      <div className="container max-w-[1280px] mx-auto px-4 py-6 md:px-6 md:py-8 lg:py-10">
        
        {/* Header Section */}
        <div className="mb-6 space-y-2">
           <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground">{property.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-muted-foreground font-medium">
               <div className="flex items-center gap-1">
                 <Star className="h-4 w-4 fill-primary text-primary" />
                 <span className="text-foreground font-semibold">4.92</span>
                 <span className="underline decoration-muted-foreground/40 hidden sm:inline">· 128 reviews</span>
               </div>
               <span className="hidden sm:inline">·</span>
               <div className="flex items-center gap-1 text-foreground underline decoration-muted-foreground/40 cursor-pointer">
                 <Globe className="h-4 w-4" />
                 <span>{property.location}</span>
               </div>
            </div>
        </div>

        {/* Gallery */}
        <PropertyGallery images={property.image_urls || []} />

        <div className="mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 relative">
          
          {/* Main Content Column */}
          <div className="space-y-8">
            
            {/* Host Info / Summary */}
            <div className="flex items-center justify-between pb-6 border-b border-border">
               <div className="space-y-1">
                  <h2 className="text-xl md:text-2xl font-semibold">Hosted by Superhost</h2>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm md:text-base">
                     <span>{property.max_guests} guests</span>
                     <span>·</span>
                     <span>2 bedrooms</span>
                     <span>·</span>
                     <span>2 beds</span>
                     <span>·</span>
                     <span>1 bath</span>
                  </div>
               </div>
               <Avatar className="h-12 w-12 md:h-14 md:w-14 border border-border">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
               </Avatar>
            </div>

            {/* Key Features */}
            <div className="space-y-6 pb-6 border-b border-border">
                <div className="flex gap-4 items-start">
                   <Medal className="h-6 w-6 text-foreground shrink-0 mt-0.5" />
                   <div>
                      <h3 className="font-semibold text-base">Superhost</h3>
                      <p className="text-muted-foreground text-sm">Superhosts are experienced, highly rated hosts.</p>
                   </div>
                </div>
                 <div className="flex gap-4 items-start">
                   <Shield className="h-6 w-6 text-foreground shrink-0 mt-0.5" />
                   <div>
                      <h3 className="font-semibold text-base">Secure Booking</h3>
                      <p className="text-muted-foreground text-sm">Your booking is protected by our guarantee.</p>
                   </div>
                </div>
                 <div className="flex gap-4 items-start">
                   <MapPin className="h-6 w-6 text-foreground shrink-0 mt-0.5" />
                   <div>
                      <h3 className="font-semibold text-base">Great Location</h3>
                      <p className="text-muted-foreground text-sm">100% of recent guests gave the location a 5-star rating.</p>
                   </div>
                </div>
            </div>

            {/* Description */}
            <div className="pb-6 border-b border-border">
              <h2 className="text-xl font-semibold mb-4">About this place</h2>
              <div className="text-muted-foreground leading-relaxed text-base md:text-lg space-y-4">
                  <p>{property.description}</p>
                  <p>
                    Enjoy a stylish experience at this centrally-located place. Modern amenities,
                    comfortable furnishings, and a prime location make this the perfect home base
                    for your next adventure.
                  </p>
              </div>
            </div>

            {/* Amenities */}
            <div className="pb-6 border-b border-border">
              <h2 className="text-xl font-semibold mb-6">What this place offers</h2>
              <AmenitiesList amenities={property.amenities || []} />
            </div>

             {/* Map Section */}
             <div className="pb-6">
                <h2 className="text-xl font-semibold mb-6">Where you’ll be</h2>
                <div className="w-full h-[400px]">
                    <PropertyMap location={property.location} />
                </div>
                <div className="mt-4 space-y-2">
                    <h3 className="font-semibold">{property.location}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        We’ll send you the exact location once your booking is confirmed. 
                        The area is known for its stunning desert landscapes and clear night skies, 
                        perfect for stargazing.
                    </p>
                    <div className="flex gap-2">
                        <button className="text-sm font-semibold underline decoration-foreground/30 hover:decoration-foreground transition-all">
                            Show more about the location
                        </button>
                    </div>
                </div>
             </div>

          </div>

          {/* Sidebar / Booking Widget (Desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
               <BookingWidget property={property} />
               <div className="mt-4 flex items-center justify-center gap-2 text-muted-foreground text-sm">
                   <Shield className="h-4 w-4" />
                   <span>Report this listing</span>
               </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Booking Footer */}
      <MobileBookingFooter property={property} />
    </div>
  )
}
