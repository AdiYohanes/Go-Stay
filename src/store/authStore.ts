import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  isLoading: boolean
  checkUser: () => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  checkUser: async () => {
    try {
      set({ isLoading: true })
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      set({ user })
    } catch (error) {
      console.error('Error checking user:', error)
      set({ user: null })
    } finally {
      set({ isLoading: false })
    }
  },
  signOut: async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      set({ user: null })
    } catch (error) {
      console.error('Error signing out:', error)
    }
  },
}))
