'use server'

import { createClient } from '@/lib/supabase/server'
import { searchSchema } from '@/lib/validations/search'
import { safeAction, ActionResult } from '@/lib/action-utils'
import { SearchResult, SearchParams } from '@/types/search.types'
import { Property } from '@/types/property.types'
import { checkAvailability } from '@/lib/availability.server'

/**
 * Search properties with filtering and sorting
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 9.3
 */
export async function searchProperties(
  params: SearchParams
): Promise<ActionResult<SearchResult>> {
  return safeAction(async () => {
    const supabase = await createClient()

    // Validate input
    const validatedParams = searchSchema.parse(params)
    
    const {
      location,
      checkIn,
      checkOut,
      guests,
      minPrice,
      maxPrice,
      amenities,
      page,
      limit,
      sortBy,
    } = validatedParams

    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from('properties')
      .select('*', { count: 'exact' })

    // Location filter - partial text matching (case-insensitive)
    // Requirement 3.1
    if (location) {
      query = query.ilike('location', `%${location}%`)
    }

    // Guest count filter - max_guests >= guests
    // Requirement 3.3
    if (guests) {
      query = query.gte('max_guests', guests)
    }

    // Price range filter
    // Requirement 3.4
    if (minPrice !== undefined) {
      query = query.gte('price_per_night', minPrice)
    }
    if (maxPrice !== undefined) {
      query = query.lte('price_per_night', maxPrice)
    }

    // Amenities filter - contains all selected amenities
    // Requirement 3.5
    if (amenities && amenities.length > 0) {
      query = query.contains('amenities', amenities)
    }

    // Apply sorting - using only columns that exist in database
    // Requirement 3.6
    switch (sortBy) {
      case 'price_asc':
        query = query.order('price_per_night', { ascending: true })
        break
      case 'price_desc':
        query = query.order('price_per_night', { ascending: false })
        break
      case 'rating':
      case 'relevance':
      case 'newest':
      default:
        // Default to newest first (rating column not yet in database)
        query = query.order('created_at', { ascending: false })
        break
    }

    // If we need to check availability, fetch more results to account for filtering
    // Otherwise use normal pagination
    const fetchLimit = (checkIn && checkOut) ? limit * 3 : limit
    const fetchOffset = (checkIn && checkOut) ? 0 : offset

    // Apply pagination
    // Requirement 9.3
    const { data: properties, error, count } = await query
      .range(fetchOffset, fetchOffset + fetchLimit - 1)

    if (error) {
      throw new Error(error.message)
    }

    let filteredProperties = (properties || []) as Property[]

    // Date range filter with availability check
    // Requirement 3.2
    if (checkIn && checkOut) {
      const startDate = new Date(checkIn)
      const endDate = new Date(checkOut)

      // Filter properties by availability
      const availabilityChecks = await Promise.all(
        filteredProperties.map(async (property) => {
          try {
            const result = await checkAvailability(property.id, startDate, endDate)
            return { property, available: result.available }
          } catch (error) {
            // If availability check fails, exclude the property to be safe
            return { property, available: false }
          }
        })
      )

      filteredProperties = availabilityChecks
        .filter(({ available }) => available)
        .map(({ property }) => property)

      // Apply pagination to filtered results
      const start = offset
      const end = offset + limit
      filteredProperties = filteredProperties.slice(start, end)
    }

    // Calculate pagination
    const total = checkIn && checkOut ? filteredProperties.length : (count || 0)
    const totalPages = Math.ceil(total / limit)
    const hasMore = page < totalPages

    return {
      properties: filteredProperties,
      total,
      page,
      totalPages,
      hasMore,
    }
  })
}
