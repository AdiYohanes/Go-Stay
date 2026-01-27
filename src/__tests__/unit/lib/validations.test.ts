import { describe, it, expect } from "vitest";
import { propertySchema } from "@/lib/validations/property";
import { bookingSchema } from "@/lib/validations/booking";
import { reviewSchema } from "@/lib/validations/review";
import { searchSchema } from "@/lib/validations/search";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import { cartItemSchema } from "@/lib/validations/cart";

describe("Validation Schemas", () => {
  describe("propertySchema", () => {
    it("should validate valid property data", () => {
      const validProperty = {
        title: "Beautiful Beach House",
        description: "A stunning property by the beach",
        price_per_night: 150,
        location: "Miami Beach",
        max_guests: 4,
        bedrooms: 2,
        beds: 2,
        bathrooms: 2,
        amenities: ["WiFi", "Pool"],
      };

      const result = propertySchema.safeParse(validProperty);
      expect(result.success).toBe(true);
    });

    it("should reject property with invalid price", () => {
      const invalidProperty = {
        title: "Beach House",
        price_per_night: -50,
        location: "Miami",
        max_guests: 4,
      };

      const result = propertySchema.safeParse(invalidProperty);
      expect(result.success).toBe(false);
    });
  });

  describe("bookingSchema", () => {
    it("should validate valid booking data", () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfter = new Date();
      dayAfter.setDate(dayAfter.getDate() + 2);

      const validBooking = {
        property_id: "123e4567-e89b-12d3-a456-426614174000",
        start_date: tomorrow,
        end_date: dayAfter,
        guests: 2,
      };

      const result = bookingSchema.safeParse(validBooking);
      expect(result.success).toBe(true);
    });

    it("should reject booking with end date before start date", () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const today = new Date();

      const invalidBooking = {
        property_id: "123e4567-e89b-12d3-a456-426614174000",
        start_date: tomorrow,
        end_date: today,
        guests: 2,
      };

      const result = bookingSchema.safeParse(invalidBooking);
      expect(result.success).toBe(false);
    });
  });

  describe("reviewSchema", () => {
    it("should validate valid review data", () => {
      const validReview = {
        property_id: "123e4567-e89b-12d3-a456-426614174000",
        rating: 5,
        comment: "Great place!",
      };

      const result = reviewSchema.safeParse(validReview);
      expect(result.success).toBe(true);
    });

    it("should reject review with invalid rating", () => {
      const invalidReview = {
        property_id: "123e4567-e89b-12d3-a456-426614174000",
        rating: 6,
        comment: "Too high rating",
      };

      const result = reviewSchema.safeParse(invalidReview);
      expect(result.success).toBe(false);
    });
  });

  describe("searchSchema", () => {
    it("should validate valid search params", () => {
      const validSearch = {
        location: "Miami",
        guests: 2,
        minPrice: 50,
        maxPrice: 200,
        page: 1,
        limit: 20,
      };

      const result = searchSchema.safeParse(validSearch);
      expect(result.success).toBe(true);
    });
  });

  describe("authSchemas", () => {
    it("should validate valid login data", () => {
      const validLogin = {
        email: "user@example.com",
        password: "password123",
      };

      const result = loginSchema.safeParse(validLogin);
      expect(result.success).toBe(true);
    });

    it("should validate valid registration data", () => {
      const validRegister = {
        email: "user@example.com",
        password: "password123",
        full_name: "John Doe",
      };

      const result = registerSchema.safeParse(validRegister);
      expect(result.success).toBe(true);
    });

    it("should reject registration with short password", () => {
      const invalidRegister = {
        email: "user@example.com",
        password: "short",
        full_name: "John Doe",
      };

      const result = registerSchema.safeParse(invalidRegister);
      expect(result.success).toBe(false);
    });
  });

  describe("cartItemSchema", () => {
    it("should validate valid cart item", () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfter = new Date();
      dayAfter.setDate(dayAfter.getDate() + 2);

      const validCartItem = {
        property_id: "123e4567-e89b-12d3-a456-426614174000",
        start_date: tomorrow,
        end_date: dayAfter,
        guests: 2,
      };

      const result = cartItemSchema.safeParse(validCartItem);
      expect(result.success).toBe(true);
    });
  });
});
