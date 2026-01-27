import { z } from "zod";

export const bookingSchema = z
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

export const updateBookingStatusSchema = z.object({
  booking_id: z.string().uuid("Invalid booking ID"),
  status: z.enum(["pending", "confirmed", "cancelled", "completed"], {
    message: "Invalid booking status",
  }),
});

export const cancelBookingSchema = z.object({
  booking_id: z.string().uuid("Invalid booking ID"),
});

export type BookingFormData = z.infer<typeof bookingSchema>;
export type UpdateBookingStatusData = z.infer<typeof updateBookingStatusSchema>;
export type CancelBookingData = z.infer<typeof cancelBookingSchema>;
