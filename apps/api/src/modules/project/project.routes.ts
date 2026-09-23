import { Router } from "express";
import { validateRequest } from "../../shared/middlewares/validateRequest.js";
import { requireAuth } from "../auth/auth.middleware.js";
import { projectController } from "./project.controller.js";
import {
    createProjectSchema,
    updateProjectSchema,
    addProjectMemberSchema,
    updateProjectMemberSchema,
    projectIdSchema,
    workspaceIdSchema,
    projectMemberIdSchema,
} from "./project.validation.js";

export const projectRoutes: Router = Router();

projectRoutes.use(requireAuth);

// --- Workspace Project Routes ---

projectRoutes.post(
    "/workspaces/:workspaceId/projects",
    validateRequest({ 
        params: workspaceIdSchema,
        body: createProjectSchema,
    }),
    projectController.createProject.bind(projectController)
);

projectRoutes.get(
    "/workspaces/:workspaceId/projects",
    validateRequest({ params: workspaceIdSchema }),
    projectController.getProjects.bind(projectController)
);

// --- Project Routes ---

projectRoutes.get(
    "/projects/:projectId",
    validateRequest({ params: projectIdSchema }),
    projectController.getProject.bind(projectController)
);

projectRoutes.patch(
    "/projects/:projectId",
    validateRequest({
        params: projectIdSchema,
        body: updateProjectSchema,
    }),
    projectController.updateProject.bind(projectController)
);

projectRoutes.delete(
    "/projects/:projectId",
    validateRequest({ params: projectIdSchema }),
    projectController.deleteProject.bind(projectController)
);

// --- Project Member Routes ---

projectRoutes.get(
    "/projects/:projectId/members",
    validateRequest({ params: projectIdSchema }),
    projectController.getMembers.bind(projectController)
);

projectRoutes.post(
    "/projects/:projectId/members",
    validateRequest({
        params: projectIdSchema,
        body: addProjectMemberSchema,
    }),
    projectController.addMember.bind(projectController)
);

projectRoutes.patch(
    "/projects/:projectId/members/:userId",
    validateRequest({
        params: projectMemberIdSchema,
        body: updateProjectMemberSchema,
    }),
    projectController.updateMemberRole.bind(projectController)
);

projectRoutes.delete(
    "/projects/:projectId/members/:userId",
    validateRequest({ params: projectMemberIdSchema }),
    projectController.removeMember.bind(projectController)
);
