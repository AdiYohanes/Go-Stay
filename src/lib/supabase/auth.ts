'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { loginSchema, registerSchema, passwordResetSchema } from '@/lib/validations/auth'
import { safeAction, type ActionResult } from '@/lib/action-utils'

/**
 * Sign in with Google OAuth
 * Redirects to Google OAuth consent screen
 */
export async function signInWithGoogle(): Promise<ActionResult<{ url: string }>> {
  return safeAction(async () => {
    const origin = (await headers()).get('origin')
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    })

    if (error) {
      throw new Error(error.message)
    }

    if (!data.url) {
      throw new Error('Failed to generate OAuth URL')
    }

    return { url: data.url }
  })
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<ActionResult<void>> {
  return safeAction(async () => {
    // Validate input
    const validated = loginSchema.parse({ email, password })

    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email: validated.email,
      password: validated.password,
    })

    if (error) {
      // Generic error message for security (don't reveal which field is wrong)
      throw new Error('Invalid credentials')
    }

    revalidatePath('/', 'layout')
  })
}

/**
 * Sign up with email and password
 */
export async function signUp(
  email: string,
  password: string,
  fullName: string
): Promise<ActionResult<{ message: string }>> {
  return safeAction(async () => {
    // Validate input
    const validated = registerSchema.parse({
      email,
      password,
      full_name: fullName,
    })

    const origin = (await headers()).get('origin')
    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
      email: validated.email,
      password: validated.password,
      options: {
        data: {
          full_name: validated.full_name,
        },
        emailRedirectTo: `${origin}/auth/callback`,
      },
    })

    if (error) {
      throw new Error(error.message)
    }

    return {
      message: 'Check your email to confirm your account',
    }
  })
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<ActionResult<void>> {
  return safeAction(async () => {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath('/', 'layout')
  })
}

/**
 * Request password reset email
 */
export async function requestPasswordReset(
  email: string
): Promise<ActionResult<{ message: string }>> {
  return safeAction(async () => {
    // Validate input
    const validated = passwordResetSchema.parse({ email })

    const origin = (await headers()).get('origin')
    const supabase = await createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(
      validated.email,
      {
        redirectTo: `${origin}/reset-password`,
      }
    )

    if (error) {
      throw new Error(error.message)
    }

    return {
      message: 'Check your email for password reset instructions',
    }
  })
}

/**
 * Update password (used after reset)
 */
export async function updatePassword(
  newPassword: string
): Promise<ActionResult<{ message: string }>> {
  return safeAction(async () => {
    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters')
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      throw new Error(error.message)
    }

    return {
      message: 'Password updated successfully',
    }
  })
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    return null
  }

  return user
}

/**
 * Get the current user's profile with role
 */
export async function getCurrentUserProfile() {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return null
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError) {
    return null
  }

  return profile
}
