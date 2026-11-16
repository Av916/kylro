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
export interface WorkspaceInvitation { id: string; email: string; role: ProjectRole; status: string; deliveryStatus: string; expiresAt: string; createdAt: string }
export interface Notification { id: string; title: string; href: string; readAt: string | null; createdAt: string; workspaceId: string; projectId: string | null }
export const invitationApi = {
    list: (workspaceId: string) => request<WorkspaceInvitation[]>(`/workspaces/${workspaceId}/invitations`),
    send: (workspaceId: string, email: string, role: string) => request<WorkspaceInvitation>(`/workspaces/${workspaceId}/invitations`, "POST", { email, role }),
    revoke: (workspaceId: string, id: string) => request<void>(`/workspaces/${workspaceId}/invitations/${id}`, "DELETE"),
    preview: (token: string) => request<WorkspaceInvitation & { workspaceName: string; workspaceId: string }>(`/invitations/${token}`),
    signIn: (token: string) => request(`/invitations/${token}/sign-in`, "POST"),
    accept: (token: string) => request<{ workspaceId: string }>(`/invitations/${token}/accept`, "POST"),
};
export const notificationApi = {
    list: (offset = 0) => request<{ items: Notification[]; unreadCount: number; nextOffset: number | null }>(`/notifications?offset=${offset}`),
    read: (id: string, read: boolean) => request<Notification>(`/notifications/${id}`, "PATCH", { read }),
    readAll: () => request<void>("/notifications/read-all", "POST"),
};
