'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

import { cn } from '@/lib/utils'
import { SearchBar } from './SearchBar'

interface Slide {
  id: number
  title: string
  subtitle: string
  description: string
  image: string
  accentColor: string
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Pesan Sekarang",
    subtitle: "Hemat hingga 40%",
    description: "Kami bandingkan harga hotel dari ratusan situs terpercaya",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1920&auto=format&fit=crop",
    accentColor: "text-sky-400"
  },
  {
    id: 2,
    title: "Liburan Impian",
    subtitle: "Destinasi Terbaik",
    description: "Temukan penginapan sempurna untuk petualangan Anda",
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1920&auto=format&fit=crop",
    accentColor: "text-emerald-400"
  },
  {
    id: 3,
    title: "Promo Spesial",
    subtitle: "Weekend Getaway",
    description: "Nikmati diskon eksklusif untuk staycation akhir pekan",
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1920&auto=format&fit=crop",
    accentColor: "text-violet-400"
  },
  {
    id: 4,
    title: "Flash Sale",
    subtitle: "Harga Terbaik",
    description: "Jangan lewatkan penawaran terbatas waktu ini",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1920&auto=format&fit=crop",
    accentColor: "text-orange-400"
  }
]

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [])



  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    // Resume autoplay after 5 seconds
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  // Auto-play slideshow
  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide])

  const slide = slides[currentSlide]

  return (
    <section className="relative w-full">
      {/* Background Images */}
      <div className="absolute inset-0 z-0">
        {slides.map((s, index) => (
          <div
            key={s.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              currentSlide === index ? "opacity-100" : "opacity-0"
            )}
          >
            {/* Image */}
            <div className="absolute inset-0 overflow-hidden">
                <Image 
                  src={s.image}
                  alt={s.title}
                  fill
                  priority={index === 0}
                  className="object-cover transition-transform duration-[10000ms] ease-linear will-change-transform"
                  style={{ 
                    transform: currentSlide === index ? 'scale(1.1)' : 'scale(1.0)'
                  }}
                  sizes="100vw"
                />
            </div>
            {/* Dark Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
          </div>
        ))}
      </div>
      
      {/* Hero Banner Container - Heights */}
      <div className="relative w-full min-h-[550px] md:min-h-[600px] lg:min-h-[700px] overflow-hidden">
        
        {/* Decorative Elements - Abstract shapes (Subtle) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute right-[10%] top-[15%] w-32 h-32 md:w-48 md:h-48 border border-white/10 rounded-3xl transform rotate-12 shadow-2xl animate-float backdrop-blur-[2px]" />
          <div className="absolute right-[5%] top-[55%] w-20 h-20 md:w-28 md:h-28 bg-white/5 rounded-xl transform rotate-45 shadow-lg animate-float" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-6 px-4 pt-28 md:pt-36 lg:pt-40 pb-32 md:pb-40">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-white/90 text-sm font-medium">Promo Terbatas</span>
            </div>

            {/* Main Title */}
            <h1 className={cn(
              "text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-2 transition-all duration-500",
              slide.accentColor
            )}>
              {slide.title}
            </h1>
            
            {/* Subtitle with gradient */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              {slide.subtitle}
            </h2>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-white/90 max-w-md mb-8 font-medium shadow-black/10 drop-shadow-md">
              {slide.description}
            </p>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 text-white/90 font-medium">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm drop-shadow-md">4.9 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm drop-shadow-md">1000+ Destinasi</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm drop-shadow-md">Booking Aman</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows - Desktop only */}


        {/* Slide Indicators */}
        <div className="absolute bottom-28 md:bottom-36 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300 shadow-sm",
                currentSlide === index 
                  ? "w-8 bg-white" 
                  : "w-2 bg-white/40 hover:bg-white/60"
              )}
            />
          ))}
        </div>
      </div>

      {/* Search Bar - Overlapping */}
      <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-20">
        <div className="w-full max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-6 px-4">
          <div className="flex justify-center">
            <SearchBar />
          </div>
        </div>
      </div>
    </section>
  )
}
