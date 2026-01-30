'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { addToFavorites, removeFromFavorites, checkIsFavorite } from '@/actions/favorites'
import { toast } from 'sonner'

/**
 * Hook for managing favorites with optimistic updates
 * Requirements: Customer favorites feature
 */
export function useFavorites(propertyId: string, initialIsFavorited: boolean = false) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
  const [isPending, startTransition] = useTransition()
  const [isInitializing, setIsInitializing] = useState(true)
  const router = useRouter()

  // Fetch actual favorite status on mount
  useEffect(() => {
    let mounted = true
    
    async function fetchFavoriteStatus() {
      try {
        const result = await checkIsFavorite(propertyId)
        if (mounted && result.success) {
          setIsFavorited(result.data)
        }
      } catch (error) {
        // Silently fail - user might not be logged in
      } finally {
        if (mounted) {
          setIsInitializing(false)
        }
      }
    }
    
    fetchFavoriteStatus()
    
    return () => {
      mounted = false
    }
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
              toast.error('Silakan login untuk mengelola favorit')
              router.push('/login')
              return
            }
            
            toast.error(result.error || 'Gagal menghapus dari favorit')
          } else {
            toast.success('Dihapus dari favorit')
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
              toast.error('Silakan login untuk menambah favorit')
              router.push('/login')
              return
            }
            
            // Don't show error if already favorited (race condition)
            if (!result.error?.includes('already')) {
              toast.error(result.error || 'Gagal menambah ke favorit')
            } else {
              // Already favorited, just update state
              setIsFavorited(true)
            }
          } else {
            toast.success('Ditambahkan ke favorit')
          }
        }
      } catch (error) {
        // Revert on error
        setIsFavorited(previousState)
        toast.error('Terjadi kesalahan')
      }
    })
  }

  return {
    isFavorited,
    isPending: isPending || isInitializing,
    toggleFavorite,
  }
}
