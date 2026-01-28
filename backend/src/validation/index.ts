export * from "./whitelists";
export * from "./schemas";

/**
 * Validation helper to parse and validate request data with Zod
 */
import { ZodSchema, ZodError } from "zod";

export function validateRequest<T>(schema: ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const messages = error.issues.map(
        (err) => `${err.path.join(".")}: ${err.message}`,
      );
      throw new Error(`Validation failed: ${messages.join(", ")}`);
    }
    throw error;
  }
}
