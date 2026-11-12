import { request, type Project, type ProjectRole, type ProjectMember, type Issue, issueKey } from "./project-api";
export interface Workspace { id: string; name: string; slug: string; role: ProjectRole; createdAt: string }
export interface WorkspaceProject extends Project { role: ProjectRole; issueCount: number; memberCount: number }
export interface WorkspaceData { workspace: Workspace; projects: WorkspaceProject[]; issues: Issue[]; members: ProjectMember[] }
export const workspaceApi = {
    user: () => request<{ user: { id: string; name: string; email: string } }>("/auth/me"),
    list: () => request<Workspace[]>("/workspaces"),
    dashboard: (id: string) => request<WorkspaceData>(`/workspaces/${id}/dashboard`),
    create: (name: string, slug: string) => request<Workspace>("/workspaces", "POST", { name, slug }),
    update: (id: string, name: string, slug: string) => request<Workspace>(`/workspaces/${id}`, "PATCH", { name, slug }),
    remove: (id: string) => request(`/workspaces/${id}`, "DELETE"),
    addMember: (id: string, email: string, role: string) => request(`/workspaces/${id}/members`, "POST", { email, role }),
    changeRole: (id: string, userId: string, role: string) => request(`/workspaces/${id}/members/${userId}`, "PATCH", { role }),
    removeMember: (id: string, userId: string) => request(`/workspaces/${id}/members/${userId}`, "DELETE"),
    logout: () => request("/auth/logout", "POST"),
};
export const issueHref = (issue: Issue) => `/projects/${issue.projectId}/issues?q=${issueKey(issue)}`;
export function workspaceActivity(data: WorkspaceData) {
    return [
        ...data.projects.map(p => ({ id: `p-${p.id}`, title: `Project created: ${p.name}`, date: p.createdAt, href: `/projects/${p.id}` })),
        ...data.issues.map(i => ({ id: `i-${i.id}`, title: `${i.updatedAt !== i.createdAt ? "Issue updated" : "Issue created"}: ${i.title}`, date: i.updatedAt, href: issueHref(i) })),
        ...data.members.map(m => ({ id: `m-${m.userId}`, title: `${m.name} joined the workspace`, date: m.createdAt, href: "/workspace/members" })),
    ].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}
