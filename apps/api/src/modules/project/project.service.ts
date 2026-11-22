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
        const workspace = await workspaceService.getWorkspace(userId, workspaceId);
        if (workspace.role === "viewer") throw ApiError.forbidden("Viewers cannot create projects");

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
        const workspace = await workspaceService.getWorkspace(userId, workspaceId);

        const projects = await db
            .select({
                id: schemas.projects.id,
                name: schemas.projects.name,
                workspaceId: schemas.projects.workspaceId,
                createdAt: schemas.projects.createdAt,
                updatedAt: schemas.projects.updatedAt,
                role: schemas.projectMembers.role,
            })
            .from(schemas.projects)
            // Project membership is separate from workspace membership.
            .leftJoin(
                schemas.projectMembers,
                and(eq(schemas.projects.id, schemas.projectMembers.projectId), eq(schemas.projectMembers.userId, userId))
            )
            .where(
                and(
                    eq(schemas.projects.workspaceId, workspaceId),
                    workspace.role === "owner" || workspace.role === "admin"
                        ? undefined
                        : eq(schemas.projectMembers.userId, userId)
                )
            );

        return projects.map(project => ({ ...project, role: this.effectiveRole(workspace.role, project.role)! }));
    }

    /**
     * Get a project through explicit membership or inherited workspace authority.
     */
    async getProject(userId: string, projectId: string) {
        const [project] = await db.select().from(schemas.projects)
            .where(eq(schemas.projects.id, projectId)).limit(1);
        if (!project) throw ApiError.notFound("Project not found or you do not have access");

        const workspace = await workspaceService.getWorkspace(userId, project.workspaceId);
        const [membership] = await db.select({ role: schemas.projectMembers.role })
            .from(schemas.projectMembers)
            .where(and(eq(schemas.projectMembers.userId, userId), eq(schemas.projectMembers.projectId, projectId)))
            .limit(1);
        const role = this.effectiveRole(workspace.role, membership?.role);
        if (!role) throw ApiError.notFound("Project not found or you do not have access");

        return { project, role, canManageAdmins: workspace.role === "owner" || workspace.role === "admin" || membership?.role === "owner" };
    }

    private effectiveRole(workspaceRole: string, projectRole?: "owner" | "admin" | "member" | "viewer" | null) {
        if (workspaceRole === "owner") return "owner" as const;
        if (projectRole === "owner") return "owner" as const;
        if (workspaceRole === "admin") return "admin" as const;
        return projectRole;
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
     * Delete a project. Requires workspace owner or project owner role.
     */
    async deleteProject(userId: string, projectId: string) {
        const { role } = await this.getProject(userId, projectId);

        if (role !== "owner") {
            throw ApiError.forbidden("Only the workspace owner or project owner can delete the project");
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
