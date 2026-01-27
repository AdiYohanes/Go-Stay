import { z } from "zod";
import { AppError } from "./errors";

export type ActionResult<T> =
  | { success: true; data: T }
  | {
      success: false;
      error: string;
      code: string;
      details?: Record<string, string[]>;
    };

export async function safeAction<T>(
  fn: () => Promise<T>,
): Promise<ActionResult<T>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        details: error.flatten().fieldErrors as Record<string, string[]>,
      };
    }
    if (error instanceof AppError) {
      return {
        success: false,
        error: error.message,
        code: error.code,
        details: error.details as Record<string, string[]>,
      };
    }
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
      code: "INTERNAL_ERROR",
    };
  }
}
