"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Grid3x3 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * PropertyGallery component with lightbox modal
 * Requirements: 1.6, 7.3
 *
 * Features:
 * - Image grid with lightbox modal
 * - Framer Motion entrance animations
 * - Keyboard navigation in lightbox
 * - Lazy load images for performance
 */

interface PropertyGalleryProps {
  images: string[];
  title: string;
  className?: string;
}

export function PropertyGallery({
  images,
  title,
  className,
}: PropertyGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "Escape") {
        e.preventDefault();
        setLightboxOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, handlePrevious, handleNext]);

  // Use placeholder if no images
  const displayImages =
    images.length > 0
      ? images
      : [
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200",
        ];

  return (
    <>
      {/* Image Grid */}
      <div className={cn("relative", className)}>
        {displayImages.length === 1 ? (
          // Single image layout
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-[16/9] overflow-hidden rounded-xl cursor-pointer group"
            onClick={() => openLightbox(0)}
          >
            <Image
              src={displayImages[0]}
              alt={`${title} - Image 1`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1200px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </motion.div>
        ) : displayImages.length === 2 ? (
          // Two images layout
          <div className="grid grid-cols-2 gap-2">
            {displayImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative aspect-[4/3] overflow-hidden rounded-xl cursor-pointer group"
                onClick={() => openLightbox(index)}
              >
                <Image
                  src={image}
                  alt={`${title} - Image ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 40vw, 600px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </motion.div>
            ))}
          </div>
        ) : (
          // Grid layout for 3+ images
          <div className="grid grid-cols-4 gap-2">
            {/* Main large image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="col-span-2 row-span-2 relative aspect-square overflow-hidden rounded-xl cursor-pointer group"
              onClick={() => openLightbox(0)}
            >
              <Image
                src={displayImages[0]}
                alt={`${title} - Image 1`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </motion.div>

            {/* Smaller images */}
            {displayImages.slice(1, 5).map((image, index) => (
              <motion.div
                key={index + 1}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
                className="col-span-1 relative aspect-square overflow-hidden rounded-xl cursor-pointer group"
                onClick={() => openLightbox(index + 1)}
              >
                <Image
                  src={image}
                  alt={`${title} - Image ${index + 2}`}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 300px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                {/* Show all photos button on last visible image */}
                {index === 3 && displayImages.length > 5 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Grid3x3 className="h-6 w-6 mx-auto mb-1" />
                      <span className="text-sm font-medium">
                        +{displayImages.length - 5} more
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Show all photos button */}
        {displayImages.length > 1 && (
          <Button
            variant="outline"
            size="sm"
            className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm hover:bg-white gap-2"
            onClick={() => openLightbox(0)}
          >
            <Grid3x3 className="h-4 w-4" />
            Show all photos
          </Button>
        )}
      </div>

      {/* Lightbox Modal */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          className="max-w-[95vw] max-h-[95vh] p-0 bg-black border-none"
          showCloseButton={false}
        >
          <div className="relative w-full h-[95vh] flex items-center justify-center">
            {/* Close button */}
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>

            {/* Image counter */}
            <div className="absolute top-4 left-4 z-50 bg-black/50 text-white px-3 py-1.5 rounded-full text-sm font-medium">
              {currentIndex + 1} / {displayImages.length}
            </div>

            {/* Previous button */}
            {displayImages.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full h-12 w-12"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}

            {/* Next button */}
            {displayImages.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full h-12 w-12"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            )}

            {/* Image display with animation */}
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={displayImages[currentIndex]}
                alt={`${title} - Image ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              />
            </AnimatePresence>

            {/* Thumbnail strip */}
            {displayImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-[90vw] overflow-x-auto">
                <div className="flex gap-2 px-4">
                  {displayImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={cn(
                        "relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                        index === currentIndex
                          ? "border-white scale-110"
                          : "border-transparent opacity-60 hover:opacity-100",
                      )}
                    >
                      <Image
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Keyboard hints */}
            {displayImages.length > 1 && (
              <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 text-white/60 text-xs">
                Use arrow keys to navigate
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
