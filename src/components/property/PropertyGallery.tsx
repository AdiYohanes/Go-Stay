'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Grid, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from '@/components/ui/dialog'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'

interface PropertyGalleryProps {
  images: string[]
}

export function PropertyGallery({ images }: PropertyGalleryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Demo images fallback with more variety
  const allImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1600', // Exterior
    'https://images.unsplash.com/photo-1512918760383-edaefe0cb88e?auto=format&fit=crop&q=80&w=1600', // Pool
    'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&q=80&w=1600', // Living Room
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?auto=format&fit=crop&q=80&w=1600', // Bedroom
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1600', // Kitchen/Dining
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=1600', // Bedroom 2
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1600', // Bathroom
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=1600'  // Interior Detail
  ]

  const displayImages = allImages.slice(0, 5)

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setIsOpen(true)
  }

  const handleNext = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  }, [allImages.length])

  const handlePrev = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }, [allImages.length])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleNext, handlePrev])

  return (
    <>
      {/* Main Grid Gallery */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[300px] md:h-[400px] lg:h-[480px]">
          
          {/* Main Hero Image (Left Side) */}
          <div 
             className="relative h-full w-full group cursor-pointer overflow-hidden md:rounded-l-xl"
             onClick={() => openLightbox(0)}
          >
            <Image
              src={displayImages[0]}
              alt="Property Main View"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
          </div>

          {/* Right Side Grid (2x2) */}
          <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-2 h-full">
              {displayImages.slice(1).map((img, idx) => (
                  <div 
                    key={idx} 
                    className={cn(
                        "relative h-full w-full group cursor-pointer overflow-hidden",
                         // Rounded corners for the right side corners logic
                         idx === 1 && "rounded-tr-xl",
                         idx === 3 && "rounded-br-xl"
                    )}
                    onClick={() => openLightbox(idx + 1)}
                  >
                      <Image
                          src={img}
                          alt={`Property View ${idx + 2}`}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  </div>
              ))}
          </div>
        </div>
        
        {/* 'Show all photos' Button */}
        <div className="absolute bottom-4 right-4 z-10">
          <Button 
            variant="secondary" 
            size="sm" 
            className="gap-2 shadow-lg backdrop-blur-md bg-white/90 hover:bg-white border-black/5"
            onClick={() => openLightbox(0)}
          >
              <Grid className="w-4 h-4" />
              Show all photos
          </Button>
        </div>
      </div>

      {/* Lightbox Dialog */ }
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-screen w-screen h-screen p-0 bg-black/95 border-none flex flex-col items-center justify-center focus:outline-none overflow-hidden duration-0">
            <VisuallyHidden.Root>
              <DialogTitle>Image Gallery</DialogTitle>
            </VisuallyHidden.Root>
            
            {/* Close Button */}
            <DialogClose className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors">
                 <X className="w-8 h-8" />
                 <span className="sr-only">Close</span>
            </DialogClose>

            {/* Main Image Container */}
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="relative w-full h-full">
                   <Image 
                      src={allImages[currentImageIndex]}
                      alt={`View ${currentImageIndex + 1}`}
                      fill
                      className="object-contain"
                      sizes="100vw"
                      priority
                      quality={100}
                   />
                </div>
            </div>

            {/* Navigation Buttons */}
            <button 
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-all hover:scale-105 outline-none"
            >
                <ChevronLeft className="w-10 h-10" />
            </button>

            <button 
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-all hover:scale-105 outline-none"
            >
                <ChevronRight className="w-10 h-10" />
            </button>
            
            {/* Counter */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/90 font-medium text-lg tracking-wide bg-black/40 px-6 py-2 rounded-full backdrop-blur-sm border border-white/10">
                {currentImageIndex + 1} / {allImages.length}
            </div>

        </DialogContent>
      </Dialog>
    </>
  )
}
