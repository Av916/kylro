import type { NextFunction, Request, Response } from "express";
import ApiResponse from "../../shared/utils/ApiResponse.js";
import { workspaceService } from "./workspace.service.js";
import type { CreateWorkspaceInput, UpdateWorkspaceInput } from "./workspace.validation.js";

export class WorkspaceController {
    /**
     * POST /api/workspaces
     * Create a new workspace.
     */
    async createWorkspace(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // req.user is guaranteed to be present by requireAuth middleware
            const userId = req.user!.id;
            const data = req.body as CreateWorkspaceInput;

            const workspace = await workspaceService.createWorkspace(userId, data);

            ApiResponse.created(res, "Workspace created successfully", workspace);
        } catch (err) {
            next(err);
        }
    }

    /**
     * GET /api/workspaces
     * Get all workspaces the authenticated user is a member of.
     */
    async getWorkspaces(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;

            const workspaces = await workspaceService.getWorkspaces(userId);

            ApiResponse.success(res, "Workspaces retrieved successfully", workspaces);
        } catch (err) {
            next(err);
        }
    }

    /**
     * GET /api/workspaces/:workspaceId
     * Get a specific workspace if the user is a member.
     */
    async getWorkspace(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { workspaceId } = req.params as { workspaceId: string };

            const workspace = await workspaceService.getWorkspace(userId, workspaceId);

            ApiResponse.success(res, "Workspace retrieved successfully", workspace);
        } catch (err) {
            next(err);
        }
    }

    /**
     * PATCH /api/workspaces/:workspaceId
     * Update a workspace.
     */
    async updateWorkspace(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { workspaceId } = req.params as { workspaceId: string };
            const data = req.body as UpdateWorkspaceInput;

            const workspace = await workspaceService.updateWorkspace(userId, workspaceId, data);

            ApiResponse.success(res, "Workspace updated successfully", workspace);
        } catch (err) {
            next(err);
        }
    }

    /**
     * DELETE /api/workspaces/:workspaceId
     * Delete a workspace.
     */
    async deleteWorkspace(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { workspaceId } = req.params as { workspaceId: string };

            await workspaceService.deleteWorkspace(userId, workspaceId);

            ApiResponse.success(res, "Workspace deleted successfully");
        } catch (err) {
            next(err);
        }
    }
}

export const workspaceController = new WorkspaceController();
