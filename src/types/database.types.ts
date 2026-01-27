export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          role: 'user' | 'admin'
          notification_preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role?: 'user' | 'admin'
          notification_preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role?: 'user' | 'admin'
          notification_preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          title: string
          description: string | null
          price_per_night: number
          location: string
          latitude: number | null
          longitude: number | null
          image_urls: string[]
          amenities: string[]
          max_guests: number
          bedrooms: number
          beds: number
          bathrooms: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          price_per_night: number
          location: string
          latitude?: number | null
          longitude?: number | null
          image_urls?: string[]
          amenities?: string[]
          max_guests?: number
          bedrooms?: number
          beds?: number
          bathrooms?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          price_per_night?: number
          location?: string
          latitude?: number | null
          longitude?: number | null
          image_urls?: string[]
          amenities?: string[]
          max_guests?: number
          bedrooms?: number
          beds?: number
          bathrooms?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          property_id: string
          user_id: string
          start_date: string
          end_date: string
          guests: number
          total_price: number
          service_fee: number
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          special_requests: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          user_id: string
          start_date: string
          end_date: string
          guests?: number
          total_price: number
          service_fee?: number
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          special_requests?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          user_id?: string
          start_date?: string
          end_date?: string
          guests?: number
          total_price?: number
          service_fee?: number
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          special_requests?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          property_id: string
          user_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          user_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          property_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
