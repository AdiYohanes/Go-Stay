import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  checkUser: () => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      isAdmin: false,
      
      checkUser: async () => {
        try {
          set({ isLoading: true });
          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user) {
            // Check if user is admin
            const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', user.id)
              .single();

            const isAdmin = (profile as { role: string } | null)?.role === 'admin';
            set({ user, isAdmin });
          } else {
            set({ user: null, isAdmin: false });
          }
        } catch (error) {
          console.error('Error checking user:', error);
          set({ user: null, isAdmin: false });
        } finally {
          set({ isLoading: false });
        }
      },

      signOut: async () => {
        try {
          const supabase = createClient();
          await supabase.auth.signOut();
          set({ user: null, isAdmin: false });
        } catch (error) {
          console.error('Error signing out:', error);
        }
      },

      setUser: (user) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAdmin: state.isAdmin }),
    }
  )
);

