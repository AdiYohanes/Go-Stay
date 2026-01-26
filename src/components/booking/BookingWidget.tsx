'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ChevronDown, Minus, Plus } from 'lucide-react'
import { format, differenceInCalendarDays, addDays } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  const [guests, setGuests] = useState(1)
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

  // Guest handling
  const incrementGuests = () => setGuests(prev => Math.min(prev + 1, property.max_guests))
  const decrementGuests = () => setGuests(prev => Math.max(prev - 1, 1))

  return (
    <Card className="shadow-xl border-border/40 rounded-2xl overflow-hidden sticky top-24">
      <CardHeader className="p-6 pb-4">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-2xl">${property.price_per_night}</span>
            <span className="text-muted-foreground font-light">night</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-foreground">
             <span className="font-bold">★ 4.92</span>
             <span className="text-muted-foreground">·</span>
             <span className="text-muted-foreground underline decoration-muted-foreground/40 font-medium">128 reviews</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        <div className="space-y-4">
          
          {/* Booking Inputs Container */}
          <div className="rounded-xl border border-input overflow-hidden divide-y divide-input">
             {/* Dates Grid */}
             <div className="grid grid-cols-2 divide-x divide-input">
               <Popover>
                  <PopoverTrigger asChild>
                    <button className="p-3 text-left hover:bg-accent/50 transition-colors">
                       <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Check-in</div>
                       <div className={cn("text-sm truncate", !date?.from && "text-muted-foreground")}>
                          {date?.from ? format(date.from, "M/d/yyyy") : "Add date"}
                       </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                      disabled={(date) => date < new Date() || date > addDays(new Date(), 365)}
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                   <PopoverTrigger asChild>
                    <button className="p-3 text-left hover:bg-accent/50 transition-colors">
                       <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Check-out</div>
                       <div className={cn("text-sm truncate", !date?.to && "text-muted-foreground")}>
                          {date?.to ? format(date.to, "M/d/yyyy") : "Add date"}
                       </div>
                    </button>
                   </PopoverTrigger>
                   <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                      disabled={(date) => date < new Date() || date > addDays(new Date(), 365)}
                    />
                  </PopoverContent>
                </Popover>
             </div>

             {/* Guests Dropdown */}
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-full p-3 text-left hover:bg-accent/50 transition-colors flex justify-between items-center group">
                     <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Guests</div>
                        <div className="text-sm">{guests} guest{guests > 1 ? 's' : ''}</div>
                     </div>
                     <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[300px] p-4" align="end">
                   <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                         <div className="font-medium text-sm">Guests</div>
                         <div className="text-muted-foreground text-xs">Ages 13 or above</div>
                      </div>
                      <div className="flex items-center gap-3">
                         <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 rounded-full border-input"
                            onClick={decrementGuests}
                            disabled={guests <= 1}
                         >
                            <Minus className="h-3 w-3" />
                         </Button>
                         <span className="w-4 text-center text-sm">{guests}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 rounded-full border-input"
                            onClick={incrementGuests}
                            disabled={guests >= property.max_guests}
                         >
                            <Plus className="h-3 w-3" />
                         </Button>
                      </div>
                   </div>
                   <div className="mt-4 text-xs text-muted-foreground">
                      This property has a maximum capacity of {property.max_guests} guests.
                   </div>
                </DropdownMenuContent>
             </DropdownMenu>
          </div>

          <Button 
            className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold text-lg py-6 transition-all shadow-md hover:shadow-lg" 
            size="lg" 
            onClick={handleBooking} 
            disabled={isBooking}
          >
            {isBooking ? (
               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                nights > 0 ? 'Reserve' : 'Check availability'
            )}
          </Button>

          {nights === 0 && (
             <div className="text-center text-sm text-muted-foreground font-light pt-2">
                You won't be charged yet
             </div>
          )}

          {nights > 0 && (
            <div className="space-y-4 pt-4">
               <div className="space-y-3 pb-4 border-b border-border">
                  <div className="flex justify-between text-base text-foreground/80 font-light">
                     <span className="underline decoration-muted-foreground/40">${property.price_per_night} x {nights} nights</span>
                     <span>${totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-base text-foreground/80 font-light">
                     <span className="underline decoration-muted-foreground/40">Service fee</span>
                     <span>${serviceFee}</span>
                  </div>
               </div>
               <div className="flex justify-between text-lg font-semibold pt-2">
                  <span>Total</span>
                  <span>${grandTotal}</span>
               </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
