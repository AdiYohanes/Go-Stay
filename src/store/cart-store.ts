/**
 * Cart state management with Zustand
 * Manages client-side cart state and item count
 */

import { create } from 'zustand';
import { Cart } from '@/types/cart.types';

interface CartStore {
  cart: Cart | null;
  itemCount: number;
  isLoading: boolean;
  
  // Actions
  setCart: (cart: Cart) => void;
  setItemCount: (count: number) => void;
  setLoading: (loading: boolean) => void;
  incrementItemCount: () => void;
  decrementItemCount: () => void;
  resetCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  cart: null,
  itemCount: 0,
  isLoading: false,

  setCart: (cart) =>
    set({
      cart,
      itemCount: cart.summary.itemCount,
    }),

  setItemCount: (count) =>
    set({
      itemCount: count,
    }),

  setLoading: (loading) =>
    set({
      isLoading: loading,
    }),

  incrementItemCount: () =>
    set((state) => ({
      itemCount: state.itemCount + 1,
    })),

  decrementItemCount: () =>
    set((state) => ({
      itemCount: Math.max(0, state.itemCount - 1),
    })),

  resetCart: () =>
    set({
      cart: null,
      itemCount: 0,
      isLoading: false,
    }),
}));
