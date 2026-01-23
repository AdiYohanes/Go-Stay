'use client'

import React from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SearchBar() {
  return (
    <div className="border rounded-full shadow-sm hover:shadow-md transition-shadow cursor-pointer py-2.5 px-4 flex items-center gap-4 bg-background border-border/60">
      <div className="font-semibold text-sm pl-2">Anywhere</div>
      <div className="h-6 w-px bg-border"></div>
      <div className="font-semibold text-sm">Any week</div>
      <div className="h-6 w-px bg-border"></div>
      <div className="text-sm text-muted-foreground pr-2 flex items-center gap-3">
        <span>Add guests</span>
        <div className="bg-primary text-primary-foreground p-2 rounded-full">
          <Search className="h-4 w-4 stroke-[3px]" />
        </div>
      </div>
    </div>
  )
}
