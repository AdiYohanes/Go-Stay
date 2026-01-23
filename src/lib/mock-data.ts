import { Database } from '@/types/database.types'

type Property = Database['public']['Tables']['properties']['Row']

export const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Modern Loft in Downtown',
    description: 'Beautiful loft with city views, perfect for a weekend getaway. Close to all amenities and transport.',
    price_per_night: 150,
    location: 'New York, NY',
    image_urls: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1000'],
    amenities: ['Wifi', 'Kitchen', 'AC', 'Washer'],
    max_guests: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Cozy Mountain Cabin',
    description: 'Escape to nature in this cozy cabin capable of hosting families. Hiking trails right outside.',
    price_per_night: 220,
    location: 'Aspen, CO',
    image_urls: ['https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=1000'],
    amenities: ['Fireplace', 'Parking', 'Wifi', 'Kitchen'],
    max_guests: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Beachfront Villa',
    description: 'Luxury villa right on the sand. Private pool and stunning sunset views.',
    price_per_night: 450,
    location: 'Miami, FL',
    image_urls: ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=1000'],
    amenities: ['Pool', 'Beach access', 'Wifi', 'Kitchen'],
    max_guests: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Minimalist Studio',
    description: 'Clean and modern studio in the heart of the arts district.',
    price_per_night: 95,
    location: 'Austin, TX',
    image_urls: ['https://images.unsplash.com/photo-1596178065849-ae6189c7eb3a?auto=format&fit=crop&q=80&w=1000'],
    amenities: ['Wifi', 'AC', 'Workspace'],
    max_guests: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const MOCK_BOOKINGS = [
  {
    id: 'b1',
    property_id: '1',
    user_id: 'user1',
    start_date: new Date(Date.now() + 86400000).toISOString(), // tomorrow
    end_date: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days later
    total_price: 450,
    status: 'confirmed',
    created_at: new Date().toISOString(),
    property: MOCK_PROPERTIES[0],
  },
  {
    id: 'b2',
    property_id: '2',
    user_id: 'user1',
    start_date: new Date(Date.now() - 86400000 * 10).toISOString(),
    end_date: new Date(Date.now() - 86400000 * 7).toISOString(),
    total_price: 660,
    status: 'completed',
    created_at: new Date().toISOString(),
    property: MOCK_PROPERTIES[1],
  },
]
