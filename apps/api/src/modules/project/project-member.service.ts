import { and, db, eq, schemas } from "@kylro/database";
import ApiError from "../../shared/utils/ApiError.js";
import { projectService } from "./project.service.js";
import { workspaceService } from "../workspace/workspace.service.js";
import type { AddProjectMemberInput, UpdateProjectMemberInput } from "./project.validation.js";

export class ProjectMemberService {
    /**
     * Get all members of a project.
     * Requires the authenticated user to be a member of the project.
     */
    async getMembers(userId: string, projectId: string) {
        // Verify current user's access
        await projectService.getProject(userId, projectId);

        const members = await db
            .select({
                userId: schemas.projectMembers.userId,
                role: schemas.projectMembers.role,
                name: schemas.users.name,
                username: schemas.users.username,
                email: schemas.users.email,
            })
            .from(schemas.projectMembers)
            .innerJoin(schemas.users, eq(schemas.projectMembers.userId, schemas.users.id))
            .where(eq(schemas.projectMembers.projectId, projectId));

        return members;
    }

    /**
     * Add a user to a project.
     * Requires current user to be owner or admin.
     * Target user must be a member of the project's workspace.
     */
    async addMember(userId: string, projectId: string, data: AddProjectMemberInput) {
        // Verify current user's role
        const { project, role } = await projectService.getProject(userId, projectId);

        if (role !== "owner" && role !== "admin") {
            throw ApiError.forbidden("You do not have permission to add members to this project");
        }

        if ((data.role as string) === "owner") {
            throw ApiError.forbidden("Cannot assign owner role through this endpoint");
        }

        // Verify target user is part of the workspace
        try {
            await workspaceService.getWorkspace(data.userId, project.workspaceId);
        } catch (err) {
            throw ApiError.badRequest("User is not a member of this workspace");
        }

        // Check if target user is already in the project
        const existingMember = await db
            .select()
            .from(schemas.projectMembers)
            .where(
                and(
                    eq(schemas.projectMembers.projectId, projectId),
                    eq(schemas.projectMembers.userId, data.userId)
                )
            )
            .limit(1);

        if (existingMember.length > 0) {
            throw ApiError.conflict("User is already a member of this project");
        }

        const [newMember] = await db
            .insert(schemas.projectMembers)
            .values({
                projectId,
                userId: data.userId,
                role: data.role,
            })
            .returning();

        return newMember;
    }

    /**
     * Update a project member's role.
     * Requires current user to be owner or admin.
     */
    async updateMemberRole(userId: string, projectId: string, targetUserId: string, data: UpdateProjectMemberInput) {
        const { role: currentUserRole } = await projectService.getProject(userId, projectId);

        if (currentUserRole !== "owner" && currentUserRole !== "admin") {
            throw ApiError.forbidden("You do not have permission to update member roles");
        }

        if ((data.role as string) === "owner") {
            throw ApiError.forbidden("Cannot assign owner role");
        }

        // Get target user's current role
        const targetMember = await db
            .select()
            .from(schemas.projectMembers)
            .where(
                and(
                    eq(schemas.projectMembers.projectId, projectId),
                    eq(schemas.projectMembers.userId, targetUserId)
                )
            )
            .limit(1);

        const member = targetMember[0];
        if (!member) {
            throw ApiError.notFound("User is not a member of this project");
        }

        if (member.role === "owner") {
            throw ApiError.forbidden("Cannot modify the role of the project owner");
        }

        const [updatedMember] = await db
            .update(schemas.projectMembers)
            .set({
                role: data.role,
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(schemas.projectMembers.projectId, projectId),
                    eq(schemas.projectMembers.userId, targetUserId)
                )
            )
            .returning();

        return updatedMember;
    }

    /**
     * Remove a member from the project.
     * Requires current user to be owner or admin.
     */
    async removeMember(userId: string, projectId: string, targetUserId: string) {
        const { role: currentUserRole } = await projectService.getProject(userId, projectId);

        if (currentUserRole !== "owner" && currentUserRole !== "admin") {
            throw ApiError.forbidden("You do not have permission to remove members");
        }

        // Get target user's current role
        const targetMember = await db
            .select()
            .from(schemas.projectMembers)
            .where(
                and(
                    eq(schemas.projectMembers.projectId, projectId),
                    eq(schemas.projectMembers.userId, targetUserId)
                )
            )
            .limit(1);

        const member = targetMember[0];
        if (!member) {
            throw ApiError.notFound("User is not a member of this project");
        }

        if (member.role === "owner") {
            throw ApiError.forbidden("Cannot remove the project owner");
        }

        await db
            .delete(schemas.projectMembers)
            .where(
                and(
                    eq(schemas.projectMembers.projectId, projectId),
                    eq(schemas.projectMembers.userId, targetUserId)
                )
            );
    }
}

export const projectMemberService = new ProjectMemberService();
