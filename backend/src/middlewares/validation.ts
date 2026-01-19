/**
 * Validation middleware using Zod schemas
 * Validates request query parameters, route parameters, and body
 */
import { z } from "zod";
import type { Context, Next } from "koa";

export interface ValidationSchemas {
  query?: z.ZodSchema<any>;
  params?: z.ZodSchema<any>;
  body?: z.ZodSchema<any>;
}

/**
 * Creates a validation middleware that validates request data against Zod schemas
 * Returns 400 with detailed error messages on validation failure
 */
export const validate = (schemas: ValidationSchemas) => {
  return async (ctx: Context, next: Next) => {
    try {
      // Validate query parameters
      if (schemas.query) {
        ctx.query = schemas.query.parse(ctx.query);
      }

      // Validate route parameters
      if (schemas.params) {
        ctx.params = schemas.params.parse(ctx.params);
      }

      // Validate request body
      if (schemas.body) {
        ctx.request.body = schemas.body.parse(ctx.request.body);
      }

      await next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle Zod validation errors
        const zodError = error as any;
        const issues = zodError.issues || zodError.errors || [];

        ctx.status = 400;
        ctx.body = {
          error: {
            status: 400,
            name: "ValidationError",
            message: "Invalid request parameters",
            details: {
              errors: issues.map((err: any) => ({
                path: Array.isArray(err.path)
                  ? err.path.join(".")
                  : String(err.path || ""),
                message: err.message,
                code: err.code,
              })),
            },
          },
        };
        return;
      }
      // Re-throw non-validation errors
      throw error;
    }
  };
};
