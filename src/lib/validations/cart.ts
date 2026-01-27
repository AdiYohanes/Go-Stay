import { z } from "zod";

export const cartItemSchema = z
  .object({
    property_id: z.string().uuid("Invalid property ID"),
    start_date: z.coerce
      .date()
      .refine((d) => d >= new Date(new Date().setHours(0, 0, 0, 0)), {
        message: "Start date must be today or in the future",
      }),
    end_date: z.coerce.date(),
    guests: z.number().int("Guests must be an integer").positive("Guests must be at least 1"),
  })
  .refine((data) => data.end_date > data.start_date, {
    message: "End date must be after start date",
    path: ["end_date"],
  });

export const updateCartItemSchema = z
  .object({
    cart_item_id: z.string().uuid("Invalid cart item ID"),
    start_date: z.coerce.date().optional(),
    end_date: z.coerce.date().optional(),
    guests: z.number().int("Guests must be an integer").positive("Guests must be at least 1").optional(),
  })
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        return data.end_date > data.start_date;
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["end_date"],
    }
  );

export const removeCartItemSchema = z.object({
  cart_item_id: z.string().uuid("Invalid cart item ID"),
});

export const checkoutSchema = z.object({
  payment_method: z.enum(["credit_card", "bank_transfer", "e_wallet"], {
    message: "Invalid payment method",
  }),
  special_requests: z.string().max(500, "Special requests must not exceed 500 characters").optional(),
});

export type CartItemFormData = z.infer<typeof cartItemSchema>;
export type UpdateCartItemFormData = z.infer<typeof updateCartItemSchema>;
export type RemoveCartItemFormData = z.infer<typeof removeCartItemSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
