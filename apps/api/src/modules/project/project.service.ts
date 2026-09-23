import { and, db, eq, schemas } from "@kylro/database";
import ApiError from "../../shared/utils/ApiError.js";
import { workspaceService } from "../workspace/workspace.service.js";
import type { CreateProjectInput, UpdateProjectInput } from "./project.validation.js";

export class ProjectService {
    /**
     * Create a new project inside a workspace.
     */
    async createProject(userId: string, workspaceId: string, data: CreateProjectInput) {
        // Verify user is a member of the workspace
        await workspaceService.getWorkspace(userId, workspaceId);

        return db.transaction(async (tx) => {
            const [newProject] = await tx
                .insert(schemas.projects)
                .values({
                    name: data.name,
                    workspaceId,
                })
                .returning();

            if (!newProject) {
                throw ApiError.internal("Failed to create project");
            }

            await tx.insert(schemas.projectMembers).values({
                projectId: newProject.id,
                userId,
                role: "owner",
            });

            return newProject;
        });
    }

    /**
     * Get all projects in a workspace for the authenticated user.
     */
    async getProjects(userId: string, workspaceId: string) {
        // Verify user is a member of the workspace
        await workspaceService.getWorkspace(userId, workspaceId);

        const projects = await db
            .select({
                id: schemas.projects.id,
                name: schemas.projects.name,
                workspaceId: schemas.projects.workspaceId,
                createdAt: schemas.projects.createdAt,
                updatedAt: schemas.projects.updatedAt,
            })
            .from(schemas.projects)
            // Join to ensure they are also members of the project? 
            // Wait, does the user need to be a project member to see the project?
            // "Return projects belonging to that workspace."
            // But they might only be a member of SOME projects in that workspace?
            // "GET /api/workspaces/:workspaceId/projects -> Return projects belonging to that workspace. Do NOT return projects from another workspace."
            // "A user must NOT be able to create or access a project in a workspace where they are not a member."
            // Usually, any workspace member can see all projects in the workspace. Let's return all projects in this workspace where the user is a project member. Or just all projects in the workspace? The requirement says: "Return projects belonging to that workspace." But it also says: "A project should have project members" and "Access should be determined through project_members."
            // Let's only return projects where the user is a project member!
            .innerJoin(
                schemas.projectMembers,
                eq(schemas.projects.id, schemas.projectMembers.projectId)
            )
            .where(
                and(
                    eq(schemas.projects.workspaceId, workspaceId),
                    eq(schemas.projectMembers.userId, userId)
                )
            );

        return projects;
    }

    /**
     * Get a single project, verifying project membership.
     */
    async getProject(userId: string, projectId: string) {
        const membership = await db
            .select({
                project: {
                    id: schemas.projects.id,
                    name: schemas.projects.name,
                    workspaceId: schemas.projects.workspaceId,
                    createdAt: schemas.projects.createdAt,
                    updatedAt: schemas.projects.updatedAt,
                },
                role: schemas.projectMembers.role,
            })
            .from(schemas.projectMembers)
            .innerJoin(
                schemas.projects,
                eq(schemas.projectMembers.projectId, schemas.projects.id)
            )
            .where(
                and(
                    eq(schemas.projectMembers.userId, userId),
                    eq(schemas.projectMembers.projectId, projectId)
                )
            )
            .limit(1);

        const data = membership[0];
        if (!data) {
            throw ApiError.notFound("Project not found or you do not have access");
        }

        return data;
    }

    /**
     * Update a project. Requires owner or admin role.
     */
    async updateProject(userId: string, projectId: string, data: UpdateProjectInput) {
        const { role } = await this.getProject(userId, projectId);

        if (role !== "owner" && role !== "admin") {
            throw ApiError.forbidden("You do not have permission to update this project");
        }

        const [updatedProject] = await db
            .update(schemas.projects)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(schemas.projects.id, projectId))
            .returning();

        if (!updatedProject) {
            throw ApiError.internal("Failed to update project");
        }

        return updatedProject;
    }

    /**
     * Delete a project. Requires owner role.
     */
    async deleteProject(userId: string, projectId: string) {
        const { role } = await this.getProject(userId, projectId);

        if (role !== "owner") {
            throw ApiError.forbidden("Only the project owner can delete the project");
        }

        const [deletedProject] = await db
            .delete(schemas.projects)
            .where(eq(schemas.projects.id, projectId))
            .returning();

        if (!deletedProject) {
            throw ApiError.internal("Failed to delete project");
        }

        return deletedProject;
    }
}

export const projectService = new ProjectService();
