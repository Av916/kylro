import { and, db, desc, eq, schemas } from "@kylro/database";
import ApiError from "../../shared/utils/ApiError.js";
import { projectService } from "./project.service.js";
import type { CreateIssueInput, UpdateIssueInput } from "./issue.validation.js";

export class IssueService {
    private async requireWrite(userId: string, projectId: string) {
        const access = await projectService.getProject(userId, projectId);
        if (access.role === "viewer") throw ApiError.forbidden("Viewers cannot change project issues");
        return access;
    }

    private async validateAssignee(projectId: string, assignedTo?: string | null) {
        if (!assignedTo) return;
        const [member] = await db.select({ id: schemas.projectMembers.id })
            .from(schemas.projectMembers)
            .where(and(eq(schemas.projectMembers.projectId, projectId), eq(schemas.projectMembers.userId, assignedTo)))
            .limit(1);
        if (!member) throw ApiError.badRequest("The assignee must be a member of this project");
    }

    private async findIssue(projectId: string, issueId: string) {
        const [issue] = await db.select().from(schemas.issues)
            .where(and(eq(schemas.issues.projectId, projectId), eq(schemas.issues.id, issueId))).limit(1);
        if (!issue) throw ApiError.notFound("Issue not found in this project");
        return issue;
    }

    async list(userId: string, projectId: string) {
        await projectService.getProject(userId, projectId);
        return db.select().from(schemas.issues).where(eq(schemas.issues.projectId, projectId))
            .orderBy(desc(schemas.issues.createdAt), desc(schemas.issues.id));
    }

    async create(userId: string, projectId: string, input: CreateIssueInput) {
        await this.requireWrite(userId, projectId);
        await this.validateAssignee(projectId, input.assignedTo);
        const [issue] = await db.insert(schemas.issues).values({ ...input, projectId }).returning();
        if (!issue) throw ApiError.internal("Could not create the issue");
        return issue;
    }

    async update(userId: string, projectId: string, issueId: string, input: UpdateIssueInput) {
        await this.requireWrite(userId, projectId);
        await this.validateAssignee(projectId, input.assignedTo);
        const [issue] = await db.update(schemas.issues).set({ ...input, updatedAt: new Date() })
            .where(and(eq(schemas.issues.projectId, projectId), eq(schemas.issues.id, issueId))).returning();
        if (!issue) throw ApiError.notFound("Issue not found in this project");
        return issue;
    }

    async remove(userId: string, projectId: string, issueId: string) {
        const { role } = await this.requireWrite(userId, projectId);
        if (role !== "owner" && role !== "admin") throw ApiError.forbidden("Only project owners and admins can delete issues");
        const [issue] = await db.delete(schemas.issues)
            .where(and(eq(schemas.issues.projectId, projectId), eq(schemas.issues.id, issueId))).returning();
        if (!issue) throw ApiError.notFound("Issue not found in this project");
    }

    async comments(userId: string, projectId: string, issueId: string) {
        await projectService.getProject(userId, projectId);
        await this.findIssue(projectId, issueId);
        return db.select({
            id: schemas.comments.id, content: schemas.comments.content,
            createdAt: schemas.comments.createdAt, userId: schemas.comments.userId, name: schemas.users.name,
        }).from(schemas.comments).innerJoin(schemas.users, eq(schemas.users.id, schemas.comments.userId))
            .where(eq(schemas.comments.issueId, issueId)).orderBy(schemas.comments.createdAt);
    }

    async comment(userId: string, projectId: string, issueId: string, content: string) {
        await this.requireWrite(userId, projectId);
        await this.findIssue(projectId, issueId);
        const [comment] = await db.insert(schemas.comments).values({ userId, issueId, content }).returning();
        return comment;
    }
}

export const issueService = new IssueService();
