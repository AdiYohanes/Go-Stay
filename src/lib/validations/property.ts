import { z } from "zod";

export const propertySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must not exceed 100 characters"),
  description: z.string().max(2000, "Description must not exceed 2000 characters").optional(),
  price_per_night: z.number().positive("Price must be positive").max(100000, "Price must not exceed 100,000"),
  location: z.string().min(2, "Location must be at least 2 characters").max(200, "Location must not exceed 200 characters"),
  max_guests: z.number().int("Max guests must be an integer").positive("Max guests must be positive").max(50, "Max guests must not exceed 50"),
  bedrooms: z.number().int("Bedrooms must be an integer").nonnegative("Bedrooms cannot be negative").max(20, "Bedrooms must not exceed 20").optional(),
  beds: z.number().int("Beds must be an integer").nonnegative("Beds cannot be negative").max(50, "Beds must not exceed 50").optional(),
  bathrooms: z.number().nonnegative("Bathrooms cannot be negative").max(20, "Bathrooms must not exceed 20").optional(),
  amenities: z.array(z.string()).optional(),
});

export type PropertyFormData = z.infer<typeof propertySchema>;
