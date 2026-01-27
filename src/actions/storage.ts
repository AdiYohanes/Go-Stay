'use server'

import { createClient } from '@/lib/supabase/server'
import { safeAction, ActionResult } from '@/lib/action-utils'
import { AuthorizationError, ValidationError } from '@/lib/errors'

// Allowed image types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB in bytes

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
 * Validate image file
 * Requirements: 1.2, 9.5
 */
function validateImageFile(file: File): void {
  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new ValidationError(
      'Invalid file type. Only JPEG, PNG, and WebP images are allowed.',
      { fileType: ['Must be JPEG, PNG, or WebP'] }
    )
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    throw new ValidationError(
      'File size exceeds maximum allowed size of 5MB.',
      { fileSize: ['Must be less than 5MB'] }
    )
  }
}

/**
 * Upload property images to Supabase Storage
 * Requirements: 1.2, 9.5
 */
export async function uploadPropertyImages(
  propertyId: string,
  files: File[]
): Promise<ActionResult<string[]>> {
  return safeAction(async () => {
    await checkAdminAccess()
    const supabase = await createClient()

    // Validate all files first
    for (const file of files) {
      validateImageFile(file)
    }

    const uploadedUrls: string[] = []

    // Upload each file
    for (const file of files) {
      // Generate unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const fileExtension = file.name.split('.').pop()
      const fileName = `${propertyId}/${timestamp}-${randomString}.${fileExtension}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('property-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) {
        throw new Error(`Failed to upload image: ${error.message}`)
      }

      // Get public URL with optimizations
      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(data.path, {
          transform: {
            width: 1200,
            height: 800,
            resize: 'cover',
            quality: 80,
          },
        })

      uploadedUrls.push(publicUrl)
    }

    return uploadedUrls
  })
}

/**
 * Upload a single property image from FormData
 * Requirements: 1.2, 9.5
 */
export async function uploadPropertyImage(
  propertyId: string,
  formData: FormData
): Promise<ActionResult<string>> {
  return safeAction(async () => {
    await checkAdminAccess()

    const file = formData.get('file') as File
    if (!file) {
      throw new ValidationError('No file provided', { file: ['File is required'] })
    }

    // Use the multi-file upload function for a single file
    const result = await uploadPropertyImages(propertyId, [file])
    
    if (!result.success) {
      throw new Error(result.error)
    }

    return result.data[0]
  })
}

/**
 * Delete a property image from Supabase Storage
 * Requirements: 1.2
 */
export async function deletePropertyImage(
  imageUrl: string
): Promise<ActionResult<{ deleted: boolean }>> {
  return safeAction(async () => {
    await checkAdminAccess()
    const supabase = await createClient()

    // Extract the file path from the URL
    // URL format: https://{project}.supabase.co/storage/v1/object/public/property-images/{path}
    const urlParts = imageUrl.split('/property-images/')
    if (urlParts.length < 2) {
      throw new ValidationError('Invalid image URL', { imageUrl: ['Invalid URL format'] })
    }

    const filePath = urlParts[1].split('?')[0] // Remove query parameters if any

    // Delete from storage
    const { error } = await supabase.storage
      .from('property-images')
      .remove([filePath])

    if (error) {
      throw new Error(`Failed to delete image: ${error.message}`)
    }

    return { deleted: true }
  })
}

/**
 * Delete multiple property images
 * Requirements: 1.2
 */
export async function deletePropertyImages(
  imageUrls: string[]
): Promise<ActionResult<{ deleted: number }>> {
  return safeAction(async () => {
    await checkAdminAccess()
    const supabase = await createClient()

    const filePaths: string[] = []

    // Extract file paths from URLs
    for (const imageUrl of imageUrls) {
      const urlParts = imageUrl.split('/property-images/')
      if (urlParts.length >= 2) {
        const filePath = urlParts[1].split('?')[0]
        filePaths.push(filePath)
      }
    }

    if (filePaths.length === 0) {
      throw new ValidationError('No valid image URLs provided', { 
        imageUrls: ['At least one valid URL is required'] 
      })
    }

    // Delete from storage
    const { error } = await supabase.storage
      .from('property-images')
      .remove(filePaths)

    if (error) {
      throw new Error(`Failed to delete images: ${error.message}`)
    }

    return { deleted: filePaths.length }
  })
}

/**
 * Get optimized image URL with transformations
 * Requirements: 1.2
 */
export async function getOptimizedImageUrl(
  imagePath: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
  }
): Promise<ActionResult<string>> {
  return safeAction(async () => {
    const supabase = await createClient()

    const { data: { publicUrl } } = supabase.storage
      .from('property-images')
      .getPublicUrl(imagePath, {
        transform: {
          width: options?.width || 1200,
          height: options?.height || 800,
          resize: 'cover',
          quality: options?.quality || 80,
        },
      })

    return publicUrl
  })
}
