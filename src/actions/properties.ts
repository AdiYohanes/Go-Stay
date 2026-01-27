'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { propertySchema } from '@/lib/validations/property'
import { safeAction, ActionResult } from '@/lib/action-utils'
import { NotFoundError, AuthorizationError } from '@/lib/errors'
import { Property } from '@/types/property.types'
import { Database } from '@/types/database.types'

type PropertyInsert = Database['public']['Tables']['properties']['Insert']
type PropertyUpdate = Database['public']['Tables']['properties']['Update']

/**
 * Helper function to check if user is admin
 */
async function checkAdminAccess() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new AuthorizationError('Authentication required')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // Type assertion is safe here as we know the profile structure
  if (!profile || (profile as { role: string }).role !== 'admin') {
    throw new AuthorizationError('Admin access required')
  }

  return user
}

/**
 * Create a new property
 * Requirements: 1.1, 1.7
 */
export async function createProperty(
  data: {
    title: string;
    description?: string;
    price_per_night: number;
    location: string;
    max_guests: number;
    bedrooms?: number;
    beds?: number;
    bathrooms?: number;
    amenities?: string[];
    image_urls?: string[];
  }
): Promise<ActionResult<Property>> {
  return safeAction(async () => {
    await checkAdminAccess()
    const supabase = await createClient()

    // Validate input
    const validatedData = propertySchema.parse(data)

    // Prepare insert data
    const insertData: PropertyInsert = {
      title: validatedData.title,
      description: validatedData.description || null,
      price_per_night: validatedData.price_per_night,
      location: validatedData.location,
      max_guests: validatedData.max_guests,
      bedrooms: validatedData.bedrooms || 1,
      beds: validatedData.beds || 1,
      bathrooms: validatedData.bathrooms || 1,
      amenities: validatedData.amenities || [],
      image_urls: data.image_urls || [],
      is_active: true,
    }

    // Insert property
    const { data: property, error } = await supabase
      .from('properties')
      .insert([insertData] as unknown as never)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath('/admin/properties')
    revalidatePath('/properties')
    revalidatePath('/')

    return property as Property
  })
}

/**
 * Get a single property by ID
 * Requirements: 1.6
 */
export async function getProperty(id: string): Promise<ActionResult<Property>> {
  return safeAction(async () => {
    const supabase = await createClient()

    const { data: property, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error || !property) {
      throw new NotFoundError('Property')
    }

    return property as Property
  })
}

/**
 * Get properties with pagination
 * Requirements: 1.6, 9.3
 */
export async function getProperties(params?: {
  page?: number;
  limit?: number;
  includeInactive?: boolean;
}): Promise<ActionResult<{
  properties: Property[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}>> {
  return safeAction(async () => {
    const supabase = await createClient()
    const page = params?.page || 1
    const limit = params?.limit || 20
    const includeInactive = params?.includeInactive || false
    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from('properties')
      .select('*', { count: 'exact' })

    // Filter by active status unless explicitly including inactive
    if (!includeInactive) {
      query = query.eq('is_active', true)
    }

    // Apply pagination and ordering
    const { data: properties, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw new Error(error.message)
    }

    const total = count || 0
    const totalPages = Math.ceil(total / limit)
    const hasMore = page < totalPages

    return {
      properties: (properties || []) as Property[],
      total,
      page,
      totalPages,
      hasMore,
    }
  })
}

/**
 * Update an existing property
 * Requirements: 1.3, 1.7
 */
export async function updateProperty(
  id: string,
  data: {
    title?: string;
    description?: string;
    price_per_night?: number;
    location?: string;
    max_guests?: number;
    bedrooms?: number;
    beds?: number;
    bathrooms?: number;
    amenities?: string[];
    image_urls?: string[];
  }
): Promise<ActionResult<Property>> {
  return safeAction(async () => {
    await checkAdminAccess()
    const supabase = await createClient()

    // Check if property exists
    const { data: existingProperty } = await supabase
      .from('properties')
      .select('id')
      .eq('id', id)
      .single()

    if (!existingProperty) {
      throw new NotFoundError('Property')
    }

    // Validate input (partial schema for updates)
    const updateSchema = propertySchema.partial()
    const validatedData = updateSchema.parse(data)

    // Prepare update data
    const updateData: PropertyUpdate = {
      ...validatedData,
      updated_at: new Date().toISOString(),
    }

    // Update property
    const { data: property, error } = await supabase
      .from('properties')
      .update(updateData as unknown as never)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath('/admin/properties')
    revalidatePath('/properties')
    revalidatePath(`/property/${id}`)
    revalidatePath('/')

    return property as Property
  })
}

/**
 * Delete a property (soft delete by setting is_active=false)
 * Requirements: 1.4
 */
export async function deleteProperty(id: string): Promise<ActionResult<{ id: string }>> {
  return safeAction(async () => {
    await checkAdminAccess()
    const supabase = await createClient()

    // Check if property exists
    const { data: existingProperty } = await supabase
      .from('properties')
      .select('id')
      .eq('id', id)
      .single()

    if (!existingProperty) {
      throw new NotFoundError('Property')
    }

    // Prepare update data for soft delete
    const updateData: PropertyUpdate = {
      is_active: false,
      updated_at: new Date().toISOString(),
    }

    // Soft delete by setting is_active to false
    const { error } = await supabase
      .from('properties')
      .update(updateData as unknown as never)
      .eq('id', id)

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath('/admin/properties')
    revalidatePath('/properties')
    revalidatePath('/')

    return { id }
  })
}
