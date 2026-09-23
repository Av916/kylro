import { Router } from "express";
import { validateRequest } from "../../shared/middlewares/validateRequest.js";
import { requireAuth } from "../auth/auth.middleware.js";
import { workspaceController } from "./workspace.controller.js";
import {
    createWorkspaceSchema,
    updateWorkspaceSchema,
    workspaceIdSchema,
} from "./workspace.validation.js";

export const workspaceRoutes: Router = Router();

// Apply requireAuth middleware to all routes in this router
workspaceRoutes.use(requireAuth);

workspaceRoutes.post(
    "/",
    validateRequest({ body: createWorkspaceSchema }),
    workspaceController.createWorkspace.bind(workspaceController)
);

workspaceRoutes.get(
    "/",
    workspaceController.getWorkspaces.bind(workspaceController)
);

workspaceRoutes.get(
    "/:workspaceId",
    validateRequest({ params: workspaceIdSchema }),
    workspaceController.getWorkspace.bind(workspaceController)
);

workspaceRoutes.patch(
    "/:workspaceId",
    validateRequest({
        params: workspaceIdSchema,
        body: updateWorkspaceSchema,
    }),
    workspaceController.updateWorkspace.bind(workspaceController)
);

workspaceRoutes.delete(
    "/:workspaceId",
    validateRequest({ params: workspaceIdSchema }),
    workspaceController.deleteWorkspace.bind(workspaceController)
);
