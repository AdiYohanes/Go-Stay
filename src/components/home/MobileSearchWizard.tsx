'use client'

import React, { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter
} from '@/components/ui/sheet'
import { DestinationPicker } from './DestinationPicker'
import { DatePicker } from './DatePicker'
import { GuestsSelector } from './GuestsSelector'
import { format } from 'date-fns'
import { DateRange } from 'react-day-picker'

export function MobileSearchWizard() {
  const [step, setStep] = useState<'where' | 'dates' | 'guests'>('where')
  const [open, setOpen] = useState(false)
  
  // Search State
  const [destination, setDestination] = useState('')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [guests, setGuests] = useState({ adults: 0, children: 0, infants: 0, pets: 0 })

  const totalGuests = guests.adults + guests.children

  const handleSearch = () => {
    setOpen(false)
    // In a real app, this would redirect with params
  }

  const stepTitle = {
    where: "Where to?",
    dates: "When's your trip?",
    guests: "Who's coming?"
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="rounded-full shadow-md border pl-3 pr-4 py-3 flex items-center gap-3 w-full bg-background transition-transform active:scale-95">
             <Search className="h-5 w-5 ml-1 text-foreground" strokeWidth={2.5} />
             <span className="text-sm font-bold text-foreground">Where to?</span>
        </div>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[95vh] rounded-t-2xl px-0 pb-0 overflow-y-auto w-full max-w-none bg-[#F7F7F7]">
        <SheetHeader className="px-6 pb-2 pt-4 bg-white rounded-t-2xl sticky top-0 z-10 shadow-sm border-b-0 space-y-4">
           <SheetTitle className="sr-only">Mobile Search</SheetTitle>
           {step !== 'where' && (
             <Button 
                variant="ghost" 
                size="icon" 
                className="absolute left-4 top-4 h-8 w-8 p-0 rounded-full bg-white border shadow-sm hover:bg-gray-100 z-50"
                onClick={() => setStep(step === 'guests' ? 'dates' : 'where')}
             >
                ←
             </Button>
           )}
           
           {/* Collapsed Step Summaries */}
           {step !== 'where' && (
               <div className="bg-white rounded-xl shadow-sm border p-4 flex justify-between items-center cursor-pointer" onClick={() => setStep('where')}>
                    <span className="text-sm font-medium text-muted-foreground">Where</span>
                    <span className="text-sm font-bold">{destination || 'Search destinations'}</span>
               </div>
           )}
           
           {step === 'guests' && (
               <div className="bg-white rounded-xl shadow-sm border p-4 flex justify-between items-center cursor-pointer" onClick={() => setStep('dates')}>
                    <span className="text-sm font-medium text-muted-foreground">When</span>
                    <span className="text-sm font-bold">
                      {dateRange?.from 
                        ? dateRange.to 
                          ? `${format(dateRange.from, 'd MMM')} – ${format(dateRange.to, 'd MMM')}`
                          : format(dateRange.from, 'd MMM')
                        : 'Add dates'
                      }
                    </span>
               </div>
           )}

           {/* Active Step Cards */}
           <div className="bg-white rounded-[2rem] shadow-lg p-6 animate-in slide-in-from-bottom-4 duration-300">
               <h2 className="text-2xl font-bold mb-4">{stepTitle[step]}</h2>
               
               {/* WHERE STEP CONTENT */}
               {step === 'where' && (
                    <div className="space-y-4">
                        <div className="relative">
                            <input 
                                className="w-full border rounded-xl p-4 pl-12 font-bold text-lg bg-white shadow-sm focus:ring-2 focus:ring-black focus:outline-none"
                                placeholder="Search destinations"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                autoFocus
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground stroke-[2.5px]" />
                        </div>
                        <div className="pt-2">
                             <DestinationPicker onSelect={(val) => {
                                setDestination(val)
                                setStep('dates')
                             }} />
                        </div>
                    </div>
               )}

               {/* DATES STEP CONTENT */}
               {step === 'dates' && (
                    <div className="flex flex-col items-center w-full">
                        <DatePicker 
                          value={dateRange} 
                          onSelect={(range) => setDateRange(range)} 
                        />
                    </div>
               )}

               {/* GUESTS STEP CONTENT */}
               {step === 'guests' && (
                    <div>
                         <GuestsSelector onCountsChange={setGuests} />
                    </div>
               )}
           </div>
           
        </SheetHeader>

        {/* Footer Actions */}
        <div className="fixed bottom-0 left-0 right-0 p-4 border-t bg-white flex justify-between items-center z-20">
            <Button variant="ghost" className="underline font-semibold text-base" onClick={() => {
                setDestination('')
                setDateRange(undefined)
                setGuests({ adults: 0, children: 0, infants: 0, pets: 0 })
                setStep('where')
            }}>
                Clear all
            </Button>
            
            <Button 
                size="lg" 
                className="bg-[#E51D54] hover:bg-[#D41045] text-white gap-2 px-8 h-12 rounded-lg text-base font-bold shadow-md"
                onClick={() => {
                    if (step === 'where') setStep('dates')
                    else if (step === 'dates') setStep('guests')
                    else handleSearch()
                }}
            >
                {step === 'guests' ? (
                    <>
                        <Search className="h-5 w-5 stroke-[3px]" />
                        Search
                    </>
                ) : 'Next'}
            </Button>
        </div>

      </SheetContent>
    </Sheet>
  )
}
