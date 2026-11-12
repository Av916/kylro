import type { ReactNode } from "react";
import { ProjectProvider } from "../../../components/project/ProjectProvider";
import { ProjectShell } from "../../../components/project/ProjectShell";
import "./project.css";

export default async function ProjectLayout({ children, params }: { children: ReactNode; params: Promise<{ projectId: string }> }) {
    const { projectId } = await params;
    return <ProjectProvider key={projectId} projectId={projectId}><ProjectShell>{children}</ProjectShell></ProjectProvider>;
}
