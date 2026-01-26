'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Database } from '@/types/database.types'
import { cn } from '@/lib/utils'

type Property = Database['public']['Tables']['properties']['Row']

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  // Use first image or placeholder
  const imageUrl = property.image_urls?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=500'

  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation to property detail
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  return (
    <Link href={`/property/${property.id}`} className="group block h-full relative cursor-pointer">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted mb-3">
        <img
            src={imageUrl}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Heart Icon Overlay */}
        <button 
          onClick={toggleLike}
          className="absolute bottom-3 right-3 md:top-3 md:right-3 z-10 p-2 rounded-full hover:scale-110 active:scale-95 transition-all focus:outline-none"
        >
           <svg
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="presentation"
              focusable="false"
              className={cn(
                "block h-6 w-6 stroke-[2px] overflow-visible transition-colors",
                isLiked 
                  ? "fill-[#FF385C] stroke-[#FF385C]" 
                  : "fill-black/50 stroke-white"
              )}
            >
              <path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-7c-1.8 0-3.58.68-4.95 2.05L16 8.1l-2.05-2.05a6.98 6.98 0 0 0-9.9 0A6.98 6.98 0 0 0 2 11c0 7 7 12.27 14 17z"></path>
            </svg>
        </button>
        
        {/* Guest Favorite Badge */}
        {property.max_guests > 4 && (
             <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-[2px] px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-black/5">
                Guest favorite
             </div>
        )}
      </div>

      <div className="grid gap-0.5">
        <div className="flex justify-between items-start">
            <h3 className="font-semibold text-[15px] leading-5 text-foreground truncate">{property.location}</h3>
            <div className="flex items-center gap-1 text-[14px]">
                 <span className="text-xs">★</span>
                 <span>4.91</span>
            </div>
        </div>
        
        <p className="text-muted-foreground text-[15px] leading-5 truncate">
           {property.max_guests > 5 ? 'Masked view' : 'City views'}
        </p>
        <p className="text-muted-foreground text-[15px] leading-5">
           Nov 5 – 10
        </p>
        
        <div className="mt-1 flex items-baseline gap-1 text-[15px]">
            <span className="font-semibold">${property.price_per_night}</span>
            <span className="text-foreground">night</span>
        </div>
      </div>
    </Link>
  )
}
