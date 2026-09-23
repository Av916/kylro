import type { NextFunction, Request, Response } from "express";
import ApiResponse from "../../shared/utils/ApiResponse.js";
import { projectService } from "./project.service.js";
import { projectMemberService } from "./project-member.service.js";
import type { 
    CreateProjectInput, 
    UpdateProjectInput, 
    AddProjectMemberInput, 
    UpdateProjectMemberInput 
} from "./project.validation.js";

export class ProjectController {
    /**
     * POST /workspaces/:workspaceId/projects
     */
    async createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { workspaceId } = req.params as { workspaceId: string };
            const data = req.body as CreateProjectInput;

            const project = await projectService.createProject(userId, workspaceId, data);

            ApiResponse.created(res, "Project created successfully", { project });
        } catch (err) {
            next(err);
        }
    }

    /**
     * GET /workspaces/:workspaceId/projects
     */
    async getProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { workspaceId } = req.params as { workspaceId: string };

            const projects = await projectService.getProjects(userId, workspaceId);

            ApiResponse.success(res, "Projects retrieved successfully", projects);
        } catch (err) {
            next(err);
        }
    }

    /**
     * GET /projects/:projectId
     */
    async getProject(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { projectId } = req.params as { projectId: string };

            const data = await projectService.getProject(userId, projectId);

            ApiResponse.success(res, "Project retrieved successfully", data);
        } catch (err) {
            next(err);
        }
    }

    /**
     * PATCH /projects/:projectId
     */
    async updateProject(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { projectId } = req.params as { projectId: string };
            const data = req.body as UpdateProjectInput;

            const project = await projectService.updateProject(userId, projectId, data);

            ApiResponse.success(res, "Project updated successfully", project);
        } catch (err) {
            next(err);
        }
    }

    /**
     * DELETE /projects/:projectId
     */
    async deleteProject(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { projectId } = req.params as { projectId: string };

            await projectService.deleteProject(userId, projectId);

            ApiResponse.success(res, "Project deleted successfully");
        } catch (err) {
            next(err);
        }
    }

    /**
     * GET /projects/:projectId/members
     */
    async getMembers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { projectId } = req.params as { projectId: string };

            const members = await projectMemberService.getMembers(userId, projectId);

            ApiResponse.success(res, "Project members retrieved successfully", members);
        } catch (err) {
            next(err);
        }
    }

    /**
     * POST /projects/:projectId/members
     */
    async addMember(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { projectId } = req.params as { projectId: string };
            const data = req.body as AddProjectMemberInput;

            const member = await projectMemberService.addMember(userId, projectId, data);

            ApiResponse.created(res, "Member added successfully", member);
        } catch (err) {
            next(err);
        }
    }

    /**
     * PATCH /projects/:projectId/members/:userId
     */
    async updateMemberRole(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { projectId, userId: targetUserId } = req.params as { projectId: string, userId: string };
            const data = req.body as UpdateProjectMemberInput;

            const member = await projectMemberService.updateMemberRole(userId, projectId, targetUserId, data);

            ApiResponse.success(res, "Member role updated successfully", member);
        } catch (err) {
            next(err);
        }
    }

    /**
     * DELETE /projects/:projectId/members/:userId
     */
    async removeMember(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { projectId, userId: targetUserId } = req.params as { projectId: string, userId: string };

            await projectMemberService.removeMember(userId, projectId, targetUserId);

            ApiResponse.success(res, "Member removed successfully");
        } catch (err) {
            next(err);
        }
    }
}

export const projectController = new ProjectController();
