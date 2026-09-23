import { z } from "zod";

const projectNameSchema = z
    .string()
    .trim()
    .min(2, "Project name must be at least 2 characters")
    .max(100, "Project name must not exceed 100 characters");

export const createProjectSchema = z.object({
    name: projectNameSchema,
});

export const updateProjectSchema = z.object({
    name: projectNameSchema,
});

export const addProjectMemberSchema = z.object({
    userId: z.string().uuid("Invalid user ID format"),
    role: z.enum(["admin", "member", "viewer"]),
});

export const updateProjectMemberSchema = z.object({
    role: z.enum(["admin", "member", "viewer"]),
});

export const projectIdSchema = z.object({
    projectId: z.string().uuid("Invalid project ID format"),
});

export const workspaceIdSchema = z.object({
    workspaceId: z.string().uuid("Invalid workspace ID format"),
});

export const projectMemberIdSchema = z.object({
    projectId: z.string().uuid("Invalid project ID format"),
    userId: z.string().uuid("Invalid user ID format"),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type AddProjectMemberInput = z.infer<typeof addProjectMemberSchema>;
export type UpdateProjectMemberInput = z.infer<typeof updateProjectMemberSchema>;
