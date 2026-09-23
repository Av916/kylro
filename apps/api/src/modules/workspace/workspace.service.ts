import { and, db, eq, schemas } from "@kylro/database";
import ApiError from "../../shared/utils/ApiError.js";
import type { CreateWorkspaceInput, UpdateWorkspaceInput } from "./workspace.validation.js";

export class WorkspaceService {
    /**
     * Create a new workspace and assign the user as the owner.
     */
    async createWorkspace(userId: string, data: CreateWorkspaceInput) {
        // Check if slug is already taken
        const existingWorkspace = await db
            .select()
            .from(schemas.workspaces)
            .where(eq(schemas.workspaces.slug, data.slug))
            .limit(1);

        if (existingWorkspace.length > 0) {
            throw ApiError.conflict("Workspace slug is already taken");
        }

        // Perform transaction to create workspace and membership
        return db.transaction(async (tx) => {
            const [newWorkspace] = await tx
                .insert(schemas.workspaces)
                .values({
                    name: data.name,
                     slug: data.slug,
                })
                .returning();

            if (!newWorkspace) {
                throw ApiError.internal("Failed to create workspace");
            }

            await tx.insert(schemas.workspaceMembers).values({
                workspaceId: newWorkspace.id,
                userId: userId,
                role: "owner",
            });

            return newWorkspace;
        });
    }

    /**
     * Get all workspaces the user is a member of.
     */
    async getWorkspaces(userId: string) {
        const memberships = await db
            .select({
                id: schemas.workspaces.id,
                name: schemas.workspaces.name,
                slug: schemas.workspaces.slug,
                role: schemas.workspaceMembers.role,
                createdAt: schemas.workspaces.createdAt,
                updatedAt: schemas.workspaces.updatedAt,
            })
            .from(schemas.workspaceMembers)
            .innerJoin(
                schemas.workspaces,
                eq(schemas.workspaceMembers.workspaceId, schemas.workspaces.id)
            )
            .where(eq(schemas.workspaceMembers.userId, userId));

        return memberships;
    }

    /**
     * Get a specific workspace, ensuring the user is a member.
     */
    async getWorkspace(userId: string, workspaceId: string) {
        const membership = await db
            .select({
                id: schemas.workspaces.id,
                name: schemas.workspaces.name,
                slug: schemas.workspaces.slug,
                role: schemas.workspaceMembers.role,
                createdAt: schemas.workspaces.createdAt,
                updatedAt: schemas.workspaces.updatedAt,
            })
            .from(schemas.workspaceMembers)
            .innerJoin(
                schemas.workspaces,
                eq(schemas.workspaceMembers.workspaceId, schemas.workspaces.id)
            )
            .where(
                and(
                    eq(schemas.workspaceMembers.userId, userId),
                    eq(schemas.workspaceMembers.workspaceId, workspaceId)
                )
            )
            .limit(1);

        const ws = membership[0];
        if (!ws) {
            throw ApiError.notFound("Workspace not found or you do not have access");
        }

        return ws;
    }

    /**
     * Update a workspace. Requires owner or admin role.
     */
    async updateWorkspace(userId: string, workspaceId: string, data: UpdateWorkspaceInput) {
        const membership = await this.getWorkspace(userId, workspaceId);

        if (membership.role !== "owner" && membership.role !== "admin") {
            throw ApiError.forbidden("You do not have permission to update this workspace");
        }

        if (data.slug && data.slug !== membership.slug) {
            const existingWorkspace = await db
                .select()
                .from(schemas.workspaces)
                .where(eq(schemas.workspaces.slug, data.slug))
                .limit(1);

            if (existingWorkspace.length > 0) {
                throw ApiError.conflict("Workspace slug is already taken");
            }
        }

        const [updatedWorkspace] = await db
            .update(schemas.workspaces)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(schemas.workspaces.id, workspaceId))
            .returning();

        if (!updatedWorkspace) {
            throw ApiError.internal("Failed to update workspace");
        }

        return updatedWorkspace;
    }

    /**
     * Delete a workspace. Requires owner role.
     */
    async deleteWorkspace(userId: string, workspaceId: string) {
        const membership = await this.getWorkspace(userId, workspaceId);

        if (membership.role !== "owner") {
            throw ApiError.forbidden("Only the workspace owner can delete the workspace");
        }

        const [deletedWorkspace] = await db
            .delete(schemas.workspaces)
            .where(eq(schemas.workspaces.id, workspaceId))
            .returning();

        if (!deletedWorkspace) {
            throw ApiError.internal("Failed to delete workspace");
        }

        return deletedWorkspace;
    }
}

export const workspaceService = new WorkspaceService();
