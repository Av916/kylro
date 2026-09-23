export const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api`;

export async function fetchUser() {
    const res = await fetch(`${API_URL}/auth/me`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch user");
    return res.json();
}

export async function fetchWorkspaces() {
    const res = await fetch(`${API_URL}/workspaces`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch workspaces");
    return res.json();
}

export async function createWorkspace(data: { name: string; slug?: string }) {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const res = await fetch(`${API_URL}/workspaces`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: data.name, slug: slug || "workspace" }),
    });
    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to create workspace");
    }
    return res.json();
}

export async function fetchProjects(workspaceId: string) {
    const res = await fetch(`${API_URL}/workspaces/${workspaceId}/projects`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch projects");
    return res.json();
}

export async function createProject(workspaceId: string, data: { name: string }) {
    const res = await fetch(`${API_URL}/workspaces/${workspaceId}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to create project");
    }
    return res.json();
}

export async function fetchProject(projectId: string) {
    const res = await fetch(`${API_URL}/projects/${projectId}`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch project");
    return res.json();
}

export async function fetchProjectMembers(projectId: string) {
    const res = await fetch(`${API_URL}/projects/${projectId}/members`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch project members");
    return res.json();
}

export async function addProjectMember(projectId: string, data: { userId: string; role?: string }) {
    const res = await fetch(`${API_URL}/projects/${projectId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to add member");
    }
    return res.json();
}

