import { Check } from 'lucide-react'

interface AmenitiesListProps {
  amenities: string[]
}

export function AmenitiesList({ amenities }: AmenitiesListProps) {
  if (!amenities || amenities.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-4">
      {amenities.map((amenity, index) => (
        <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
          <Check className="h-4 w-4 text-primary" />
          <span>{amenity}</span>
        </div>
      ))}
    </div>
  )
}
