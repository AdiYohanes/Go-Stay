'use server';

import { createClient } from '@/lib/supabase/server';
import { safeAction, ActionResult } from '@/lib/action-utils';
import { AuthenticationError } from '@/lib/errors';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { Database } from '@/types/database.types';

/**
 * Profile management server actions
 * Requirements: 4.3
 */

const updateProfileSchema = z.object({
  full_name: z.string().min(1).max(100).optional(),
  phone: z.string().max(20).optional().nullable(),
});

const updateNotificationPreferencesSchema = z.object({
  email_booking_confirmation: z.boolean(),
  email_booking_reminder: z.boolean(),
  email_marketing: z.boolean(),
  push_enabled: z.boolean(),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

/**
 * Update user profile information
 */
export async function updateProfile(
  data: z.infer<typeof updateProfileSchema>
): Promise<ActionResult<{ message: string }>> {
  return safeAction(async () => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new AuthenticationError();
    }

    // Validate input
    const validatedData = updateProfileSchema.parse(data);

    // Update profile with explicit typing from Database
    const updateData: Database['public']['Tables']['profiles']['Update'] = {};
    if (validatedData.full_name !== undefined) {
      updateData.full_name = validatedData.full_name;
    }
    if (validatedData.phone !== undefined) {
      updateData.phone = validatedData.phone;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('profiles')
      .update(updateData)
      .eq('id', user.id);

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    revalidatePath('/profile');

    return { message: 'Profile updated successfully' };
  });
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(
  preferences: z.infer<typeof updateNotificationPreferencesSchema>
): Promise<ActionResult<{ message: string }>> {
  return safeAction(async () => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new AuthenticationError();
    }

    // Validate input
    const validatedPreferences = updateNotificationPreferencesSchema.parse(preferences);

    // Update notification preferences
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('profiles')
      .update({ notification_preferences: validatedPreferences })
      .eq('id', user.id);

    if (error) {
      throw new Error(`Failed to update preferences: ${error.message}`);
    }

    revalidatePath('/profile');

    return { message: 'Notification preferences updated successfully' };
  });
}

/**
 * Update user password
 */
export async function updatePassword(
  data: z.infer<typeof updatePasswordSchema>
): Promise<ActionResult<{ message: string }>> {
  return safeAction(async () => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new AuthenticationError();
    }

    // Validate input
    const validatedData = updatePasswordSchema.parse(data);

    // Verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: validatedData.currentPassword,
    });

    if (signInError) {
      throw new Error('Current password is incorrect');
    }

    // Update password
    const { error } = await supabase.auth.updateUser({
      password: validatedData.newPassword,
    });

    if (error) {
      throw new Error(`Failed to update password: ${error.message}`);
    }

    return { message: 'Password updated successfully' };
  });
}
