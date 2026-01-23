'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database.types'

type PropertyInsert = Database['public']['Tables']['properties']['Insert']

export async function createProperty(formData: FormData) {
  const supabase = await createClient()

  // Basic validation would happen here with Zod
  const rawData: PropertyInsert = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    price_per_night: Number(formData.get('price')),
    location: formData.get('location') as string,
    max_guests: Number(formData.get('guests')),
    amenities: (formData.get('amenities') as string).split(',').map(s => s.trim()),
    image_urls: [], // Handle image upload separately usually
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await supabase.from('properties').insert([rawData] as any)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/properties')
  redirect('/admin/properties')
}
