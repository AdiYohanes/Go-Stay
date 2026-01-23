'use client'

import React from 'react'
import {
  Umbrella,
  TreePine,
  Waves,
  Mountain,
  Snowflake,
  Tent,
  Building,
  Castle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  { label: 'Beach', icon: Waves },
  { label: 'Cabins', icon: TreePine },
  { label: 'Trending', icon: Umbrella },
  { label: 'Camping', icon: Tent },
  { label: 'Mountain', icon: Mountain },
  { label: 'Arctic', icon: Snowflake },
  { label: 'Iconic', icon: City },
  { label: 'Castles', icon: Castle },
  { label: 'Rooms', icon: Building },
  { label: 'Lake', icon: Waves },
  { label: 'Countryside', icon: TreePine },
]

function City(props: React.ComponentProps<'svg'>) {
    return <Building {...props} />
}

export function CategoryFilter() {
  const [selected, setSelected] = React.useState('Trending')

  return (
    <div className="w-full border-b bg-background sticky top-[65px] z-40 pt-4 pb-2">
      <div className="container px-4 md:px-10 overflow-x-auto no-scrollbar">
        <div className="flex gap-8 min-w-max pb-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            const isSelected = selected === cat.label
            return (
              <button
                key={cat.label}
                onClick={() => setSelected(cat.label)}
                className={cn(
                  "flex flex-col items-center gap-2 group min-w-[64px] cursor-pointer transition-all hover:text-foreground",
                  isSelected ? "text-foreground border-b-2 border-primary pb-2" : "text-muted-foreground pb-2.5 border-b-2 border-transparent hover:border-muted-foreground/30"
                )}
              >
                <Icon className={cn("h-6 w-6 stroke-1 group-hover:scale-105 transition-transform", isSelected && "stroke-2")} />
                <span className={cn("text-xs font-medium", isSelected && "font-semibold")}>
                  {cat.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
