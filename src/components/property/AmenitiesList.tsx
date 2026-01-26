import { Check, Wifi, Car, Utensils, Tv, Thermometer, Coffee } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AmenitiesListProps {
  amenities: string[]
}

export function AmenitiesList({ amenities }: AmenitiesListProps) {
  if (!amenities || amenities.length === 0) return null

  // Basic mapping for demo purposes - in a real app this would be more robust
  const getIcon = (text: string) => {
    const lower = text.toLowerCase()
    if (lower.includes('wifi')) return Wifi
    if (lower.includes('park')) return Car
    if (lower.includes('kitchen') || lower.includes('cook')) return Utensils
    if (lower.includes('tv')) return Tv
    if (lower.includes('ac') || lower.includes('condition')) return Thermometer
    if (lower.includes('breakfast') || lower.includes('coffee')) return Coffee
    return Check
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
      {amenities.map((amenity, index) => {
        const Icon = getIcon(amenity)
        return (
          <div key={index} className="flex items-center gap-3 text-muted-foreground group">
            <Icon className="h-5 w-5 text-foreground/80 group-hover:text-primary transition-colors" />
            <span className="text-base font-light text-foreground/90">{amenity}</span>
          </div>
        )
      })}
    </div>
  )
}
