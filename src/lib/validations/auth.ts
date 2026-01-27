import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  full_name: z.string().min(2, "Full name must be at least 2 characters").max(100, "Full name must not exceed 100 characters"),
});

export const passwordResetSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const updatePasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const updateProfileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters").max(100, "Full name must not exceed 100 characters").optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number").optional(),
  avatar_url: z.string().url("Invalid URL").optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type PasswordResetFormData = z.infer<typeof passwordResetSchema>;
export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
