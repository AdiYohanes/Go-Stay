import { describe, it, expect } from "vitest";
import { safeAction } from "@/lib/action-utils";
import { AppError, ValidationError } from "@/lib/errors";
import { z } from "zod";

describe("Action Utils", () => {
  describe("safeAction", () => {
    it("should return success result for successful action", async () => {
      const action = async () => {
        return { id: "123", name: "Test" };
      };

      const result = await safeAction(action);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ id: "123", name: "Test" });
      }
    });

    it("should handle Zod validation errors", async () => {
      const schema = z.object({
        email: z.string().email(),
      });

      const action = async () => {
        schema.parse({ email: "invalid" });
        return {};
      };

      const result = await safeAction(action);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Validation failed");
        expect(result.code).toBe("VALIDATION_ERROR");
        expect(result.details).toBeDefined();
      }
    });

    it("should handle AppError instances", async () => {
      const action = async () => {
        throw new ValidationError("Invalid input", {
          field: ["Error message"],
        });
      };

      const result = await safeAction(action);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Invalid input");
        expect(result.code).toBe("VALIDATION_ERROR");
        expect(result.details).toEqual({ field: ["Error message"] });
      }
    });

    it("should handle unexpected errors", async () => {
      const action = async () => {
        throw new Error("Unexpected error");
      };

      const result = await safeAction(action);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("An unexpected error occurred");
        expect(result.code).toBe("INTERNAL_ERROR");
      }
    });
  });
});
