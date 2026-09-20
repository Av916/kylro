import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

export interface RequestValidationSchema {
    body?: ZodType;
    query?: ZodType;
    params?: ZodType;
}

/**
 * Express middleware factory to validate incoming request data (body, query, params)
 * using Zod schemas. If validation fails, the ZodError is forwarded to the centralized errorHandler.
 */
export function validateRequest(schema: RequestValidationSchema) {
    return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
        try {
            if (schema.body) {
                req.body = await schema.body.parseAsync(req.body);
            }
            if (schema.query) {
                req.query = (await schema.query.parseAsync(req.query)) as Request["query"];
            }
            if (schema.params) {
                req.params = (await schema.params.parseAsync(req.params)) as Request["params"];
            }
            next();
        } catch (err) {
            next(err);
        }
    };
}
