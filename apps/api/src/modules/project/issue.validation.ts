import { z } from "zod";

const issueFields = {
    title: z.string().trim().min(1, "A title is required").max(200),
    description: z.string().trim().max(10000).nullable(),
    status: z.enum(["todo", "in_progress", "done"]),
    assignedTo: z.uuid().nullable(),
};

export const createIssueSchema = z.object({
    title: issueFields.title,
    description: issueFields.description.optional(),
    status: issueFields.status.default("todo"),
    assignedTo: issueFields.assignedTo.optional(),
});

export const updateIssueSchema = z.object(issueFields).partial()
    .refine(value => Object.keys(value).length > 0, "Provide at least one field to update");

export const issueParamsSchema = z.object({ projectId: z.uuid(), issueId: z.uuid() });
export const createCommentSchema = z.object({ content: z.string().trim().min(1).max(5000) });
export type CreateIssueInput = z.infer<typeof createIssueSchema>;
export type UpdateIssueInput = z.infer<typeof updateIssueSchema>;
