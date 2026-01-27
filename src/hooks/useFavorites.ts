'use client'

import { useState, useTransition } from 'react'
import { addToFavorites, removeFromFavorites } from '@/actions/favorites'
import { toast } from 'sonner'

/**
 * Hook for managing favorites with optimistic updates
 * Requirements: Customer favorites feature
 */
export function useFavorites(propertyId: string, initialIsFavorited: boolean = false) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
  const [isPending, startTransition] = useTransition()

  const toggleFavorite = () => {
    // Optimistic update
    const previousState = isFavorited
    setIsFavorited(!isFavorited)

    startTransition(async () => {
      try {
        if (previousState) {
          // Remove from favorites
          const result = await removeFromFavorites(propertyId)
          if (!result.success) {
            // Revert on error
            setIsFavorited(previousState)
            toast.error(result.error || 'Failed to remove from favorites')
          } else {
            toast.success('Removed from favorites')
          }
        } else {
          // Add to favorites
          const result = await addToFavorites(propertyId)
          if (!result.success) {
            // Revert on error
            setIsFavorited(previousState)
            toast.error(result.error || 'Failed to add to favorites')
          } else {
            toast.success('Added to favorites')
          }
        }
      } catch (error) {
        // Revert on error
        setIsFavorited(previousState)
        toast.error('An unexpected error occurred')
      }
    })
  }

  return {
    isFavorited,
    isPending,
    toggleFavorite,
  }
}
