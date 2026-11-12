import { notificationRoutes } from "./notifications/notification.routes.js";
import { invitationPublicRoutes } from "./workspace/invitation.routes.js";
import { Router } from "express";
import { authRoutes } from "./auth/auth.routes.js";
import { workspaceRoutes } from "./workspace/workspace.routes.js";
import { projectRoutes } from "./project/project.routes.js";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/invitations", invitationPublicRoutes);
router.use("/workspaces", workspaceRoutes);
router.use("/", notificationRoutes);
router.use("/", projectRoutes);

export default router;
