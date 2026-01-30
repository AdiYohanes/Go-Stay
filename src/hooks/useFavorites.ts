'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { addToFavorites, removeFromFavorites, getUserFavorites } from '@/actions/favorites'
import { toast } from 'sonner'

/**
 * Hook for managing favorites with optimistic updates
 * Requirements: Customer favorites feature
 */
export function useFavorites(propertyId: string, initialIsFavorited: boolean = false) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Fetch actual favorite status on mount
  useEffect(() => {
    async function checkFavoriteStatus() {
      try {
        const result = await getUserFavorites()
        if (result.success && result.data) {
          const favoriteIds = result.data.map(fav => fav.property_id)
          setIsFavorited(favoriteIds.includes(propertyId))
        }
      } catch (error) {
        // Silently fail - user might not be logged in
      } finally {
        setIsLoading(false)
      }
    }
    
    checkFavoriteStatus()
  }, [propertyId])

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
            
            // Check if authentication error
            if (result.error?.includes('Authentication required') || 
                result.error?.includes('authentication') ||
                result.error?.includes('login')) {
              toast.error('Please login to manage favorites')
              router.push('/login')
              return
            }
            
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
            
            // Check if authentication error
            if (result.error?.includes('Authentication required') || 
                result.error?.includes('authentication') ||
                result.error?.includes('login')) {
              toast.error('Please login to add favorites')
              router.push('/login')
              return
            }
            
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
    isPending: isPending || isLoading,
    toggleFavorite,
  }
}
