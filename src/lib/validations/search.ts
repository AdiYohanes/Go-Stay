import { z } from "zod";

export const searchSchema = z.object({
  query: z.string().optional(),
  location: z.string().optional(),
  checkIn: z.string().datetime().optional(),
  checkOut: z.string().datetime().optional(),
  guests: z.number().int("Guests must be an integer").positive("Guests must be at least 1").optional(),
  minPrice: z.number().nonnegative("Minimum price cannot be negative").optional(),
  maxPrice: z.number().positive("Maximum price must be positive").optional(),
  amenities: z.array(z.string()).optional(),
  page: z.number().int("Page must be an integer").positive("Page must be at least 1").default(1),
  limit: z.number().int("Limit must be an integer").positive("Limit must be at least 1").max(50, "Limit must not exceed 50").default(20),
  sortBy: z
    .enum(["relevance", "price_asc", "price_desc", "rating", "newest"], {
      message: "Invalid sort option",
    })
    .default("relevance"),
}).refine(
  (data) => {
    if (data.minPrice !== undefined && data.maxPrice !== undefined) {
      return data.maxPrice >= data.minPrice;
    }
    return true;
  },
  {
    message: "Maximum price must be greater than or equal to minimum price",
    path: ["maxPrice"],
  }
);

export type SearchParams = z.infer<typeof searchSchema>;
