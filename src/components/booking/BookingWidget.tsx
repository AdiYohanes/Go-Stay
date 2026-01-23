'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { format, differenceInCalendarDays, addDays } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Database } from '@/types/database.types'
import { useAuthStore } from '@/store/authStore'
import { createBooking } from '@/actions/bookings'

type Property = Database['public']['Tables']['properties']['Row']

interface BookingWidgetProps {
  property: Property
}

export function BookingWidget({ property }: BookingWidgetProps) {
  const [date, setDate] = useState<DateRange | undefined>()
  const [isBooking, setIsBooking] = useState(false)
  const { user } = useAuthStore()
  const router = useRouter()

  // Calculate nights and price
  const nights = date?.from && date?.to 
    ? differenceInCalendarDays(date.to, date.from) 
    : 0
  
  const totalPrice = nights * property.price_per_night
  const serviceFee = Math.round(totalPrice * 0.10) // 10% service fee
  const grandTotal = totalPrice + serviceFee

  async function handleBooking() {
    if (!user) {
      toast.error('Please login to book this property')
      router.push('/login?next=/property/' + property.id)
      return
    }

    if (!date?.from || !date?.to) {
      toast.error('Please select check-in and check-out dates')
      return
    }

    setIsBooking(true)
    const result = await createBooking(property.id, date.from, date.to, grandTotal)
    setIsBooking(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Booking confirmed!')
      setDate(undefined)
      router.refresh()
      router.push('/my-bookings')
    }
  }

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader>
        <CardTitle className="text-xl flex items-baseline justify-between">
          <div>
            <span className="font-bold text-2xl">${property.price_per_night}</span>
            <span className="text-muted-foreground text-sm font-normal"> / night</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Check-in - Check-out</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                  disabled={(date) => date < new Date() || date > addDays(new Date(), 365)} // Disable past dates
                />
              </PopoverContent>
            </Popover>
          </div>

          {nights > 0 && (
            <div className="space-y-3 pt-3 border-t">
              <div className="flex justify-between text-sm">
                <span>${property.price_per_night} x {nights} nights</span>
                <span>${totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Service fee</span>
                <span>${serviceFee}</span>
              </div>
              <div className="flex justify-between font-bold pt-3 border-t mt-3">
                <span>Total</span>
                <span>${grandTotal}</span>
              </div>
            </div>
          )}

          <Button 
            className="w-full" 
            size="lg" 
            onClick={handleBooking} 
            disabled={isBooking || !date?.from || !date?.to}
          >
            {isBooking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {date?.from && date?.to ? 'Reserve' : 'Check availability'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
