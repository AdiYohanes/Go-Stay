/**
 * Cart server actions for the hotel booking system
 * Handles cart CRUD operations with availability checking
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { ActionResult, safeAction } from '@/lib/action-utils';
import {
  Cart,
  CartItem,
  CartItemWithDetails,
  CartSummary,
  AddToCartInput,
  UpdateCartItemInput,
} from '@/types/cart.types';
import { calculateBookingPrice } from '@/lib/price-calculator';
import { checkAvailability } from '@/lib/availability';
import { Database } from '@/types/database.types';

type CartItemRow = Database['public']['Tables']['cart_items']['Row'];
type PropertyRow = Database['public']['Tables']['properties']['Row'];

/**
 * Adds a property to the user's cart
 * @param input AddToCartInput with property_id, check_in, check_out, guests
 * @returns ActionResult with the created cart item
 */
export async function addToCart(
  input: AddToCartInput
): Promise<ActionResult<CartItem>> {
  return safeAction(async () => {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Authentication required');
    }

    // Validate dates
    const checkIn = new Date(input.check_in);
    const checkOut = new Date(input.check_out);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (checkIn < now) {
      throw new Error('Check-in date must be in the future');
    }

    if (checkOut <= checkIn) {
      throw new Error('Check-out date must be after check-in date');
    }

    // Get property to validate guest count
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('id, max_guests')
      .eq('id', input.property_id)
      .single();

    if (propertyError || !property) {
      throw new Error('Property not found');
    }

    if (input.guests > property.max_guests) {
      throw new Error(
        `Guest count exceeds property maximum of ${property.max_guests}`
      );
    }

    // Check availability
    const availability = await checkAvailability(
      input.property_id,
      checkIn,
      checkOut
    );

    if (!availability.available) {
      throw new Error('Property is not available for the selected dates');
    }

    // Insert cart item
    const { data: cartItem, error: insertError } = await supabase
      .from('cart_items')
      .insert({
        user_id: user.id,
        property_id: input.property_id,
        start_date: checkIn.toISOString().split('T')[0],
        end_date: checkOut.toISOString().split('T')[0],
        guests: input.guests,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error adding to cart:', insertError);
      throw new Error('Failed to add item to cart');
    }

    revalidatePath('/cart');
    revalidatePath('/');

    return cartItem as CartItem;
  });
}

/**
 * Removes an item from the user's cart
 * @param cartItemId The ID of the cart item to remove
 * @returns ActionResult with success status
 */
export async function removeFromCart(
  cartItemId: string
): Promise<ActionResult<{ success: boolean }>> {
  return safeAction(async () => {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Authentication required');
    }

    // Delete cart item (RLS ensures user can only delete their own items)
    const { error: deleteError } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Error removing from cart:', deleteError);
      throw new Error('Failed to remove item from cart');
    }

    revalidatePath('/cart');
    revalidatePath('/');

    return { success: true };
  });
}

/**
 * Updates a cart item's dates or guest count
 * @param cartItemId The ID of the cart item to update
 * @param input UpdateCartItemInput with optional check_in, check_out, guests
 * @returns ActionResult with the updated cart item
 */
export async function updateCartItem(
  cartItemId: string,
  input: UpdateCartItemInput
): Promise<ActionResult<CartItem>> {
  return safeAction(async () => {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Authentication required');
    }

    // Get existing cart item
    const { data: existingItem, error: fetchError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('id', cartItemId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingItem) {
      throw new Error('Cart item not found');
    }

    // Prepare update data
    const updateData: Partial<CartItemRow> = {};

    if (input.check_in) {
      const checkIn = new Date(input.check_in);
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      if (checkIn < now) {
        throw new Error('Check-in date must be in the future');
      }

      updateData.start_date = checkIn.toISOString().split('T')[0];
    }

    if (input.check_out) {
      const checkOut = new Date(input.check_out);
      updateData.end_date = checkOut.toISOString().split('T')[0];
    }

    if (input.guests !== undefined) {
      // Get property to validate guest count
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .select('max_guests')
        .eq('id', existingItem.property_id)
        .single();

      if (propertyError || !property) {
        throw new Error('Property not found');
      }

      if (input.guests > property.max_guests) {
        throw new Error(
          `Guest count exceeds property maximum of ${property.max_guests}`
        );
      }

      updateData.guests = input.guests;
    }

    // Validate dates
    const finalStartDate = updateData.start_date || existingItem.start_date;
    const finalEndDate = updateData.end_date || existingItem.end_date;

    const checkIn = new Date(finalStartDate);
    const checkOut = new Date(finalEndDate);

    if (checkOut <= checkIn) {
      throw new Error('Check-out date must be after check-in date');
    }

    // Check availability for updated dates
    const availability = await checkAvailability(
      existingItem.property_id,
      checkIn,
      checkOut
    );

    if (!availability.available) {
      throw new Error('Property is not available for the selected dates');
    }

    // Update cart item
    const { data: updatedItem, error: updateError } = await supabase
      .from('cart_items')
      .update(updateData)
      .eq('id', cartItemId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating cart item:', updateError);
      throw new Error('Failed to update cart item');
    }

    revalidatePath('/cart');
    revalidatePath('/');

    return updatedItem as CartItem;
  });
}

/**
 * Gets the user's cart with property details and availability status
 * @returns ActionResult with Cart containing items and summary
 */
export async function getCart(): Promise<ActionResult<Cart>> {
  return safeAction(async () => {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Authentication required');
    }

    // Get cart items with property details
    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select(
        `
        *,
        property:properties (
          id,
          title,
          location,
          image_urls,
          price_per_night,
          max_guests
        )
      `
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (cartError) {
      console.error('Error fetching cart:', cartError);
      throw new Error('Failed to fetch cart');
    }

    if (!cartItems || cartItems.length === 0) {
      return {
        items: [],
        summary: {
          itemCount: 0,
          subtotal: 0,
          totalServiceFee: 0,
          total: 0,
          allAvailable: true,
        },
      };
    }

    // Process cart items with pricing and availability
    const itemsWithDetails: CartItemWithDetails[] = await Promise.all(
      cartItems.map(async (item) => {
        const property = item.property as unknown as PropertyRow;
        const startDate = new Date(item.start_date);
        const endDate = new Date(item.end_date);

        // Calculate pricing
        const pricing = calculateBookingPrice(
          property.price_per_night,
          startDate,
          endDate
        );

        // Check availability
        const availability = await checkAvailability(
          item.property_id,
          startDate,
          endDate
        );

        return {
          id: item.id,
          user_id: item.user_id,
          property_id: item.property_id,
          check_in: item.start_date,
          check_out: item.end_date,
          guests: item.guests,
          created_at: item.created_at,
          updated_at: item.updated_at,
          property: {
            id: property.id,
            title: property.title,
            location: property.location,
            image_urls: property.image_urls,
            price_per_night: property.price_per_night,
            max_guests: property.max_guests,
          },
          pricing,
          isAvailable: availability.available,
        };
      })
    );

    // Calculate summary
    const summary: CartSummary = {
      itemCount: itemsWithDetails.length,
      subtotal: itemsWithDetails.reduce(
        (sum, item) => sum + item.pricing.subtotal,
        0
      ),
      totalServiceFee: itemsWithDetails.reduce(
        (sum, item) => sum + item.pricing.service_fee,
        0
      ),
      total: itemsWithDetails.reduce(
        (sum, item) => sum + item.pricing.total,
        0
      ),
      allAvailable: itemsWithDetails.every((item) => item.isAvailable),
    };

    return {
      items: itemsWithDetails,
      summary,
    };
  });
}

/**
 * Clears all items from the user's cart
 * @returns ActionResult with the number of items removed
 */
export async function clearCart(): Promise<ActionResult<{ count: number }>> {
  return safeAction(async () => {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Authentication required');
    }

    // Count items before deletion
    const { count: itemCount, error: countError } = await supabase
      .from('cart_items')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (countError) {
      console.error('Error counting cart items:', countError);
      throw new Error('Failed to count cart items');
    }

    // Delete all cart items for user
    const { error: deleteError } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Error clearing cart:', deleteError);
      throw new Error('Failed to clear cart');
    }

    revalidatePath('/cart');
    revalidatePath('/');

    return { count: itemCount || 0 };
  });
}
