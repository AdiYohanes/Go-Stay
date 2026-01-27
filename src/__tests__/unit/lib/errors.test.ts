import { describe, it, expect } from "vitest";
import {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
} from "@/lib/errors";

describe("Error Classes", () => {
  describe("AppError", () => {
    it("should create an AppError with correct properties", () => {
      const error = new AppError("Test error", "TEST_ERROR", 400, {
        field: "value",
      });

      expect(error.message).toBe("Test error");
      expect(error.code).toBe("TEST_ERROR");
      expect(error.statusCode).toBe(400);
      expect(error.details).toEqual({ field: "value" });
      expect(error.name).toBe("AppError");
    });
  });

  describe("ValidationError", () => {
    it("should create a ValidationError with correct properties", () => {
      const error = new ValidationError("Validation failed", {
        email: ["Invalid email format"],
      });

      expect(error.message).toBe("Validation failed");
      expect(error.code).toBe("VALIDATION_ERROR");
      expect(error.statusCode).toBe(400);
      expect(error.details).toEqual({ email: ["Invalid email format"] });
      expect(error.name).toBe("ValidationError");
    });
  });

  describe("AuthenticationError", () => {
    it("should create an AuthenticationError with default message", () => {
      const error = new AuthenticationError();

      expect(error.message).toBe("Authentication required");
      expect(error.code).toBe("AUTHENTICATION_ERROR");
      expect(error.statusCode).toBe(401);
      expect(error.name).toBe("AuthenticationError");
    });

    it("should create an AuthenticationError with custom message", () => {
      const error = new AuthenticationError("Invalid credentials");

      expect(error.message).toBe("Invalid credentials");
    });
  });

  describe("AuthorizationError", () => {
    it("should create an AuthorizationError with default message", () => {
      const error = new AuthorizationError();

      expect(error.message).toBe("Access denied");
      expect(error.code).toBe("AUTHORIZATION_ERROR");
      expect(error.statusCode).toBe(403);
      expect(error.name).toBe("AuthorizationError");
    });
  });

  describe("NotFoundError", () => {
    it("should create a NotFoundError with resource name", () => {
      const error = new NotFoundError("Property");

      expect(error.message).toBe("Property not found");
      expect(error.code).toBe("NOT_FOUND");
      expect(error.statusCode).toBe(404);
      expect(error.name).toBe("NotFoundError");
    });
  });

  describe("ConflictError", () => {
    it("should create a ConflictError with correct properties", () => {
      const error = new ConflictError("Resource already exists");

      expect(error.message).toBe("Resource already exists");
      expect(error.code).toBe("CONFLICT");
      expect(error.statusCode).toBe(409);
      expect(error.name).toBe("ConflictError");
    });
  });
});
