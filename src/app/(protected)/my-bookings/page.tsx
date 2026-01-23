'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, MapPinIcon } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { MOCK_BOOKINGS } from '@/lib/mock-data'

export default function MyBookingsPage() {
  // In real app: fetch bookings from Supabase
  // const { data: bookings } = await supabase.from('bookings').select('*, property:properties(*)')
  const bookings = MOCK_BOOKINGS

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">My Bookings</h1>
      
      <div className="grid gap-6">
        {bookings.length === 0 ? (
          <p className="text-muted-foreground">You have no upcoming bookings.</p>
        ) : (
          bookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 lg:w-1/4 h-48 md:h-auto relative">
                  <img
                    src={booking.property.image_urls?.[0]}
                    alt={booking.property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 lg:w-3/4 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-xl mb-1">{booking.property.title}</h3>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {booking.property.location}
                      </div>
                    </div>
                    <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                      {booking.status}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-6 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <CalendarIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Check-in</p>
                        <p className="font-medium">{format(parseISO(booking.start_date), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <CalendarIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Check-out</p>
                        <p className="font-medium">{format(parseISO(booking.end_date), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t flex justify-between items-center">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Total Paid: </span>
                      <span className="font-bold text-lg">${booking.total_price}</span>
                    </div>
                    {/* Add Cancel Booking button logic later */}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
