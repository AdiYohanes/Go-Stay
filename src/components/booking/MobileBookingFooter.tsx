'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Database } from '@/types/database.types'

type Property = Database['public']['Tables']['properties']['Row']

interface MobileBookingFooterProps {
  property: Property
}

export function MobileBookingFooter({ property }: MobileBookingFooterProps) {
  const router = useRouter()

  const handleReserveClick = () => {
    // Scroll to booking widget or open modal
    // For now, let's scroll to the date picker which usually has id="date"
    const dateElement = document.getElementById('date')
    if (dateElement) {
        dateElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        // Optional: Focus trigger
        dateElement.click()
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 py-4 px-6 bg-background border-t z-50 lg:hidden flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1">
            <span className="font-bold text-lg">${property.price_per_night}</span>
            <span className="text-muted-foreground text-sm">night</span>
        </div>
        <div className="text-xs font-semibold underline">
            Nov 5 - 10
        </div>
      </div>
      <Button size="lg" className="px-8 font-semibold" onClick={handleReserveClick}>
        Reserve
      </Button>
    </div>
  )
}
