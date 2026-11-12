import type { ReactNode } from "react";
import { WorkspaceProvider } from "../../components/workspace/WorkspaceProvider";
import { WorkspaceShell } from "../../components/workspace/WorkspaceShell";
import "../projects/[projectId]/project.css";
import "./workspace.css";
export default function WorkspaceLayout({ children }: { children: ReactNode }) {
    return <WorkspaceProvider><WorkspaceShell>{children}</WorkspaceShell></WorkspaceProvider>;
}
