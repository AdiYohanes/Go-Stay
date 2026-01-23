import Link from 'next/link'
import { MapPin, Users } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Database } from '@/types/database.types'

type Property = Database['public']['Tables']['properties']['Row']

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  // Use first image or placeholder
  const imageUrl = property.image_urls?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=500'

  return (
    <Link href={`/property/${property.id}`} className="group block h-full">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted mb-3">
        <img
            src={imageUrl}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Heart Icon Overlay */}
        <div className="absolute top-3 right-3 z-10">
           <svg
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="presentation"
              focusable="false"
              className="block h-6 w-6 stroke-white fill-black/50 stroke-[2px] overflow-visible"
            >
              <path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-7c-1.8 0-3.58.68-4.95 2.05L16 8.1l-2.05-2.05a6.98 6.98 0 0 0-9.9 0A6.98 6.98 0 0 0 2 11c0 7 7 12.27 14 17z"></path>
            </svg>
        </div>
        
        {/* Simple Guest Badge */}
        {property.max_guests > 4 && (
             <div className="absolute top-3 left-3 bg-white/90 px-2 py-0.5 rounded text-xs font-semibold shadow-sm">
                Guest favorite
             </div>
        )}
      </div>

      <div className="flex justify-between items-start gap-2">
        <div>
            <h3 className="font-semibold text-base leading-tight text-foreground truncate">{property.location}</h3>
            <p className="text-muted-foreground text-sm leading-snug truncate mt-0.5">
               {property.title}
            </p>
            <p className="text-muted-foreground text-sm leading-snug mt-0.5">
               Nov 5 - 10
            </p>
            <div className="mt-1.5 flex items-baseline gap-1">
                <span className="font-semibold text-base">${property.price_per_night}</span>
                <span className="text-foreground text-sm">night</span>
            </div>
        </div>
        <div className="flex items-center gap-1 text-sm">
             <span className="text-xs">★</span>
             <span>4.9</span>
        </div>
      </div>
    </Link>
  )
}
