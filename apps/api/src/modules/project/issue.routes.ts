import { Router, type RequestHandler } from "express";
import { validateRequest } from "../../shared/middlewares/validateRequest.js";
import ApiResponse from "../../shared/utils/ApiResponse.js";
import { projectIdSchema } from "./project.validation.js";
import { createCommentSchema, createIssueSchema, issueParamsSchema, updateIssueSchema } from "./issue.validation.js";
import { issueService } from "./issue.service.js";

// Mounted after the project router's authentication middleware.
export const issueRoutes: Router = Router();
const handle = (action: RequestHandler): RequestHandler => (req, res, next) => {
    Promise.resolve(action(req, res, next)).catch(next);
};

issueRoutes.get("/projects/:projectId/issues", validateRequest({ params: projectIdSchema }), handle(async (req, res) => {
    ApiResponse.success(res, "Issues retrieved", await issueService.list(req.user!.id, String(req.params.projectId)));
}));
issueRoutes.post("/projects/:projectId/issues", validateRequest({ params: projectIdSchema, body: createIssueSchema }), handle(async (req, res) => {
    ApiResponse.created(res, "Issue created", await issueService.create(req.user!.id, String(req.params.projectId), req.body));
}));
issueRoutes.patch("/projects/:projectId/issues/:issueId", validateRequest({ params: issueParamsSchema, body: updateIssueSchema }), handle(async (req, res) => {
    ApiResponse.success(res, "Issue updated", await issueService.update(req.user!.id, String(req.params.projectId), String(req.params.issueId), req.body));
}));
issueRoutes.delete("/projects/:projectId/issues/:issueId", validateRequest({ params: issueParamsSchema }), handle(async (req, res) => {
    await issueService.remove(req.user!.id, String(req.params.projectId), String(req.params.issueId));
    ApiResponse.noContent(res);
}));
issueRoutes.get("/projects/:projectId/issues/:issueId/comments", validateRequest({ params: issueParamsSchema }), handle(async (req, res) => {
    ApiResponse.success(res, "Comments retrieved", await issueService.comments(req.user!.id, String(req.params.projectId), String(req.params.issueId)));
}));
issueRoutes.post("/projects/:projectId/issues/:issueId/comments", validateRequest({ params: issueParamsSchema, body: createCommentSchema }), handle(async (req, res) => {
    ApiResponse.created(res, "Comment added", await issueService.comment(req.user!.id, String(req.params.projectId), String(req.params.issueId), req.body.content));
}));
