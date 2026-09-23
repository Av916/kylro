import { z } from "zod";

const nameSchema = z
    .string()
    .trim()
    .min(2, "Workspace name must be at least 2 characters")
    .max(50, "Workspace name must not exceed 50 characters");

const slugSchema = z
    .string()
    .trim()
    .toLowerCase()
    .min(2, "Slug must be at least 2 characters")
    .max(50, "Slug must not exceed 50 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug can only contain lowercase letters, numbers, and hyphens (no spaces or special characters)");

export const createWorkspaceSchema = z.object({
    name: nameSchema,
    slug: slugSchema,
});

export const updateWorkspaceSchema = z.object({
    name: nameSchema.optional(),
    slug: slugSchema.optional(),
}).refine(data => data.name !== undefined || data.slug !== undefined, {
    message: "At least one of name or slug must be provided for update",
});

export const workspaceIdSchema = z.object({
    workspaceId: z.string().uuid("Invalid workspace ID format"),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
