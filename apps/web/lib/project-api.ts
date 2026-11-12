import { API_URL } from "./api";

export type ProjectRole = "owner" | "admin" | "member" | "viewer";
export type IssueStatus = "todo" | "in_progress" | "done";
export interface Project { id: string; name: string; workspaceId: string; createdAt: string; updatedAt: string }
export interface ProjectMember { userId: string; name: string; email: string; role: ProjectRole; createdAt: string }
export interface MemberCandidate { userId: string; name: string; email: string }
export interface Issue { id: string; projectId: string; title: string; description: string | null; status: IssueStatus; assignedTo: string | null; createdAt: string; updatedAt: string }
export interface IssueInput { title: string; description: string | null; status: IssueStatus; assignedTo: string | null }
export interface IssueComment { id: string; userId: string; name: string; content: string; createdAt: string }

export class ProjectApiError extends Error {
    constructor(message: string, public status: number) { super(message); }
}

export async function request<T>(path: string, method = "GET", body?: unknown): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
        method, credentials: "include",
        headers: body === undefined ? undefined : { "Content-Type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (response.status === 204) return undefined as T;
    const payload = await response.json().catch(() => null);
    if (!response.ok) throw new ProjectApiError(payload?.message || "Something went wrong. Please try again.", response.status);
    if (!payload?.success) throw new Error("The server returned an unexpected response.");
    return payload.data as T;
}

const path = (projectId: string) => `/projects/${encodeURIComponent(projectId)}`;
export const projectApi = {
    get: (id: string) => request<{ project: Project; role: ProjectRole }>(path(id)),
    remove: (id: string) => request<void>(path(id), "DELETE"),
    rename: (id: string, name: string) => request<Project>(path(id), "PATCH", { name }),
    members: (id: string) => request<ProjectMember[]>(`${path(id)}/members`),
    candidates: (id: string) => request<MemberCandidate[]>(`${path(id)}/member-candidates`),
    addMember: (id: string, userId: string, role: Exclude<ProjectRole, "owner">) => request(`${path(id)}/members`, "POST", { userId, role }),
    changeRole: (id: string, userId: string, role: Exclude<ProjectRole, "owner">) => request(`${path(id)}/members/${userId}`, "PATCH", { role }),
    removeMember: (id: string, userId: string) => request(`${path(id)}/members/${userId}`, "DELETE"),
    issues: (id: string) => request<Issue[]>(`${path(id)}/issues`),
    createIssue: (id: string, input: IssueInput) => request<Issue>(`${path(id)}/issues`, "POST", input),
    updateIssue: (id: string, issueId: string, input: Partial<IssueInput>) => request<Issue>(`${path(id)}/issues/${issueId}`, "PATCH", input),
    deleteIssue: (id: string, issueId: string) => request<void>(`${path(id)}/issues/${issueId}`, "DELETE"),
    comments: (id: string, issueId: string) => request<IssueComment[]>(`${path(id)}/issues/${issueId}/comments`),
    addComment: (id: string, issueId: string, content: string) => request(`${path(id)}/issues/${issueId}/comments`, "POST", { content }),
};

export const statusLabels: Record<IssueStatus, string> = { todo: "To do", in_progress: "In progress", done: "Done" };
export const statuses: IssueStatus[] = ["todo", "in_progress", "done"];
export const issueKey = (issue: Issue) => `ISS-${issue.id.slice(0, 6).toUpperCase()}`;
export function dateLabel(date: string) {
    return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
export function errorMessage(error: unknown) { return error instanceof Error ? error.message : "Something went wrong. Please try again."; }
