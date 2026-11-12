"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { projectApi, ProjectApiError, errorMessage, type Issue, type IssueStatus, type Project, type ProjectMember, type ProjectRole } from "../../lib/project-api";
import { NotFoundScreen } from "../errors/NotFoundScreen";
import { IssueDialog } from "./IssueDialog";

interface ProjectContextValue {
    project: Project; role: ProjectRole; members: ProjectMember[]; issues: Issue[];
    canEdit: boolean; canManage: boolean;
    openIssue: (issue?: Issue, status?: IssueStatus) => void;
    saveIssue: (issue: Issue) => void;
    removeIssue: (id: string) => void;
    setProject: (project: Project) => void;
    refreshMembers: () => Promise<void>;
}
const ProjectContext = createContext<ProjectContextValue | null>(null);
export function useProject() {
    const value = useContext(ProjectContext);
    if (!value) throw new Error("Project components must be inside ProjectProvider");
    return value;
}

export function ProjectProvider({ projectId, children }: { projectId: string; children: ReactNode }) {
    const revision = useRef(0);
    const [data, setData] = useState<{ project: Project; role: ProjectRole; members: ProjectMember[]; issues: Issue[] } | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [attempt, setAttempt] = useState(0);
    const [editor, setEditor] = useState<{ issue?: Issue; status: IssueStatus } | null>(null);

    useEffect(() => {
        let active = true;
        Promise.all([projectApi.get(projectId), projectApi.members(projectId), projectApi.issues(projectId)])
            .then(([access, members, issues]) => { if (active) { setData({ ...access, members, issues }); setError(null); } })
            .catch(error => { if (active) setError(error instanceof Error ? error : new Error(errorMessage(error))); });
        return () => { active = false; };
    }, [projectId, attempt]);

    if (!data && error instanceof ProjectApiError && error.status === 404) return <NotFoundScreen project />;

    if (error && !data) return (
        <div className="project-gate">
            <div className="project-panel">
                <span className="project-eyebrow">LET’S GET YOU BACK ON TRACK</span>
                <h1>{error instanceof ProjectApiError && error.status === 401 ? "Your session has ended" : "We couldn’t open this project"}</h1>
                <p role="alert">{error.message}</p>
                <div className="project-actions">
                    <button className="project-button" onClick={() => { setError(null); setAttempt(value => value + 1); }}><RefreshCw size={15} /> Try again</button>
                    <Link className="project-button secondary" href={error instanceof ProjectApiError && error.status === 401 ? "/login" : "/workspace"}><ArrowLeft size={15} /> {error instanceof ProjectApiError && error.status === 401 ? "Sign in" : "Back to workspace"}</Link>
                </div>
            </div>
        </div>
    );
    if (!data) return <div className="project-gate" role="status"><span className="project-loading-mark">K</span><p>Opening your project…</p></div>;

    const value: ProjectContextValue = {
        ...data,
        canEdit: data.role !== "viewer",
        canManage: data.role === "owner" || data.role === "admin",
        openIssue: (issue, status = "todo") => setEditor({ issue, status }),
        saveIssue: issue => { revision.current++; setData(current => current && ({ ...current, issues: current.issues.some(item => item.id === issue.id) ? current.issues.map(item => item.id === issue.id ? issue : item) : [issue, ...current.issues] })); },
        removeIssue: id => { revision.current++; setData(current => current && ({ ...current, issues: current.issues.filter(issue => issue.id !== id) })); },
        setProject: project => { revision.current++; setData(current => current && ({ ...current, project })); },
        refreshMembers: async () => {
            const ticket = ++revision.current;
            const [members, access, issues] = await Promise.all([projectApi.members(projectId), projectApi.get(projectId), projectApi.issues(projectId)]);
            if (ticket === revision.current) setData({ ...access, members, issues });
        },
    };
    return <ProjectContext.Provider value={value}>{children}{editor && <IssueDialog issue={editor.issue} initialStatus={editor.status} onClose={() => setEditor(null)} />}</ProjectContext.Provider>;
}
