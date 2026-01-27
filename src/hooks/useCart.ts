/**
 * Cart operations hook
 * Provides cart CRUD operations with optimistic updates
 */

'use client';

import { useCallback, useEffect } from 'react';
import { useCartStore } from '@/store/cart-store';
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  updateCartItem as updateCartItemAction,
  getCart as getCartAction,
  clearCart as clearCartAction,
} from '@/actions/cart';
import { AddToCartInput, UpdateCartItemInput } from '@/types/cart.types';
import { toast } from 'sonner';

export function useCart() {
  const {
    cart,
    itemCount,
    isLoading,
    setCart,
    setItemCount,
    setLoading,
    incrementItemCount,
    decrementItemCount,
    resetCart,
  } = useCartStore();

  /**
   * Fetches the user's cart from the server
   */
  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getCartAction();
      if (result.success) {
        setCart(result.data);
      } else {
        console.error('Failed to fetch cart:', result.error);
        toast.error('Failed to load cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  }, [setCart, setLoading]);

  /**
   * Adds an item to the cart
   */
  const addToCart = useCallback(
    async (input: AddToCartInput) => {
      try {
        // Optimistic update
        incrementItemCount();

        const result = await addToCartAction(input);
        if (result.success) {
          toast.success('Added to cart');
          // Refresh cart to get updated data
          await fetchCart();
          return true;
        } else {
          // Rollback optimistic update
          decrementItemCount();
          toast.error(result.error || 'Failed to add to cart');
          return false;
        }
      } catch (error) {
        // Rollback optimistic update
        decrementItemCount();
        console.error('Error adding to cart:', error);
        toast.error('Failed to add to cart');
        return false;
      }
    },
    [incrementItemCount, decrementItemCount, fetchCart]
  );

  /**
   * Removes an item from the cart
   */
  const removeFromCart = useCallback(
    async (cartItemId: string) => {
      try {
        // Optimistic update
        decrementItemCount();

        const result = await removeFromCartAction(cartItemId);
        if (result.success) {
          toast.success('Removed from cart');
          // Refresh cart to get updated data
          await fetchCart();
          return true;
        } else {
          // Rollback optimistic update
          incrementItemCount();
          toast.error(result.error || 'Failed to remove from cart');
          return false;
        }
      } catch (error) {
        // Rollback optimistic update
        incrementItemCount();
        console.error('Error removing from cart:', error);
        toast.error('Failed to remove from cart');
        return false;
      }
    },
    [incrementItemCount, decrementItemCount, fetchCart]
  );

  /**
   * Updates a cart item
   */
  const updateCartItem = useCallback(
    async (cartItemId: string, input: UpdateCartItemInput) => {
      try {
        const result = await updateCartItemAction(cartItemId, input);
        if (result.success) {
          toast.success('Cart item updated');
          // Refresh cart to get updated data
          await fetchCart();
          return true;
        } else {
          toast.error(result.error || 'Failed to update cart item');
          return false;
        }
      } catch (error) {
        console.error('Error updating cart item:', error);
        toast.error('Failed to update cart item');
        return false;
      }
    },
    [fetchCart]
  );

  /**
   * Clears all items from the cart
   */
  const clearCart = useCallback(async () => {
    try {
      const result = await clearCartAction();
      if (result.success) {
        toast.success(`Removed ${result.data.count} item(s) from cart`);
        resetCart();
        return true;
      } else {
        toast.error(result.error || 'Failed to clear cart');
        return false;
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
      return false;
    }
  }, [resetCart]);

  /**
   * Load cart on mount
   */
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    cart,
    itemCount,
    isLoading,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    refreshCart: fetchCart,
  };
}
