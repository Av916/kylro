import { Router } from "express";
import { authRoutes } from "./auth/auth.routes.js";
import { workspaceRoutes } from "./workspace/workspace.routes.js";
import { projectRoutes } from "./project/project.routes.js";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/workspaces", workspaceRoutes);
router.use("/", projectRoutes);

export default router;
