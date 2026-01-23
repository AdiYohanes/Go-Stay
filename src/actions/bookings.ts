'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Database } from '@/types/database.types'

export async function createBooking(propertyId: string, startDate: Date, endDate: Date, totalPrice: number) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in to book.' }
  }

  const bookingData: Database['public']['Tables']['bookings']['Insert'] = {
    property_id: propertyId,
    user_id: user.id,
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString(),
    total_price: totalPrice,
    status: 'confirmed',
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await supabase.from('bookings').insert([bookingData] as any)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/my-bookings')
  return { success: true }
}
