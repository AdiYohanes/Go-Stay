'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { safeAction, ActionResult } from '@/lib/action-utils'
import { AuthenticationError, ConflictError, NotFoundError } from '@/lib/errors'
import { Property } from '@/types/property.types'

/**
 * Helper function to get authenticated user
 */
async function getAuthenticatedUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new AuthenticationError('Authentication required')
  }

  return user
}

/**
 * Add a property to user's favorites
 * Requirements: Customer favorites feature
 */
export async function addToFavorites(propertyId: string): Promise<ActionResult<{ id: string }>> {
  return safeAction(async () => {
    const user = await getAuthenticatedUser()
    const supabase = await createClient()

    // Check if property exists
    const { data: property } = await supabase
      .from('properties')
      .select('id')
      .eq('id', propertyId)
      .single()

    if (!property) {
      throw new NotFoundError('Property')
    }

    // Check if already favorited
    const { data: existingFavorite } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('property_id', propertyId)
      .single()

    if (existingFavorite) {
      throw new ConflictError('Property is already in favorites')
    }

    // Add to favorites
    const { data: favorite, error } = await supabase
      .from('favorites')
      .insert({
        user_id: user.id,
        property_id: propertyId,
      } as never)
      .select('id')
      .single()

    if (error) {
      throw new Error(error.message)
    }

    // Type assertion for the favorite id
    const favoriteData = favorite as { id: string }

    revalidatePath('/favorites')
    revalidatePath(`/property/${propertyId}`)
    revalidatePath('/')

    return { id: favoriteData.id }
  })
}

/**
 * Remove a property from user's favorites
 * Requirements: Customer favorites feature
 */
export async function removeFromFavorites(propertyId: string): Promise<ActionResult<{ id: string }>> {
  return safeAction(async () => {
    const user = await getAuthenticatedUser()
    const supabase = await createClient()

    // Check if favorite exists
    const { data: favorite } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('property_id', propertyId)
      .single()

    if (!favorite) {
      throw new NotFoundError('Favorite')
    }

    // Remove from favorites
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('property_id', propertyId)

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath('/favorites')
    revalidatePath(`/property/${propertyId}`)
    revalidatePath('/')

    return { id: propertyId }
  })
}

/**
 * Get user's favorite properties with full property details
 * Requirements: Customer favorites feature
 */
export async function getUserFavorites(params?: {
  page?: number;
  limit?: number;
}): Promise<ActionResult<{
  properties: Property[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}>> {
  return safeAction(async () => {
    const user = await getAuthenticatedUser()
    const supabase = await createClient()
    const page = params?.page || 1
    const limit = params?.limit || 20
    const offset = (page - 1) * limit

    // Get favorites with property details
    const { data: favorites, error, count } = await supabase
      .from('favorites')
      .select(`
        id,
        created_at,
        property:properties (
          id,
          title,
          description,
          price_per_night,
          location,
          latitude,
          longitude,
          image_urls,
          amenities,
          max_guests,
          bedrooms,
          beds,
          bathrooms,
          rating,
          review_count,
          created_at,
          updated_at
        )
      `, { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw new Error(error.message)
    }

    // Extract properties from favorites
    const properties = (favorites || [])
      .map(fav => {
        // Type assertion for the nested property
        const favData = fav as { property: Property | null }
        return favData.property
      })
      .filter((prop): prop is Property => prop !== null)

    const total = count || 0
    const totalPages = Math.ceil(total / limit)
    const hasMore = page < totalPages

    return {
      properties,
      total,
      page,
      totalPages,
      hasMore,
    }
  })
}

/**
 * Check if a property is in user's favorites
 * Requirements: Customer favorites feature
 */
export async function checkIsFavorite(propertyId: string): Promise<ActionResult<boolean>> {
  return safeAction(async () => {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // If not authenticated, return false
    if (!user) {
      return false
    }

    // Check if favorite exists
    const { data: favorite } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('property_id', propertyId)
      .single()

    return !!favorite
  })
}
