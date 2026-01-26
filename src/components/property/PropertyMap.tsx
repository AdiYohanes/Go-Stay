
'use client'

import { MapPin } from 'lucide-react'

interface PropertyMapProps {
  location: string
}

export function PropertyMap({ location }: PropertyMapProps) {
  // Create a safe URL for the embed
  const encodedLocation = encodeURIComponent(location)
  const mapUrl = `https://maps.google.com/maps?q=${encodedLocation}&t=&z=13&ie=UTF8&iwloc=&output=embed`

  return (
    <div className="w-full h-full min-h-[400px] bg-muted rounded-xl overflow-hidden relative shadow-sm border border-border/50">
      <iframe
        width="100%"
        height="100%"
        className="absolute inset-0 w-full h-full border-0 grayscale-[20%] hover:grayscale-0 transition-all duration-700"
        frameBorder="0"
        title="map"
        marginHeight={0}
        marginWidth={0}
        scrolling="no"
        src={mapUrl}
        loading="lazy"
        allowFullScreen
      ></iframe>
       {/* Overlay to prevent accidental scroll capture until interaction (optional, distinct from just showing the map) 
           For this user, simply showing it is the request. 
       */}
    </div>
  )
}
