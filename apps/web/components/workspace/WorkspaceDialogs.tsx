"use client";
import { useState, type FormEvent } from "react";
import { Modal } from "../project/ProjectUI";
import { useWorkspace } from "./WorkspaceProvider";
import { projectApi, errorMessage } from "../../lib/project-api";
import { invitationApi, workspaceApi } from "../../lib/workspace-api";
export type WorkspaceAction = "workspace" | "issue" | "member" | "invite" | "project" | null;
export function WorkspaceForm({ action, onClose }: { action: Exclude<WorkspaceAction, "project" | null>; onClose: () => void }) {
    const { data, refresh, reload } = useWorkspace();
    const projects = data?.projects.filter(p => p.role !== "viewer") || [];
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [project, setProject] = useState(projects[0]?.id || "");
    const [description, setDescription] = useState("");
    const [role, setRole] = useState("member");
    const [busy, setBusy] = useState(false), [error, setError] = useState("");
    async function submit(event: FormEvent) {
        event.preventDefault(); if (busy) return; setBusy(true); setError("");
        try {
            if (action === "workspace") { const ws = await workspaceApi.create(name.trim(), slug.trim()); await reload(ws.id); }
            else if ((action === "member" || action === "invite") && data) { if (action === "invite") await invitationApi.send(data.workspace.id, name.trim(), role); else await workspaceApi.addMember(data.workspace.id, name.trim(), role); await refresh(); }
            else if (action === "issue") { await projectApi.createIssue(project, { title: name.trim(), description: description.trim() || null, status: "todo", assignedTo: null }); await refresh(); }
            onClose();
        } catch (err) { setError(errorMessage(err)); setBusy(false); }
    }
    return <Modal title={action === "workspace" ? "Create a workspace" : action === "issue" ? "Create an issue" : action === "member" ? "Add an existing member" : "Invite a teammate"} onClose={onClose} busy={busy}>
        <form className="ws-form" onSubmit={submit}>
            <p className="ws-muted">{action === "workspace" ? "Create a workspace to organize projects and members." : action === "issue" ? "Create an issue in a project you can edit." : action === "invite" ? "Send an invitation valid for seven days. Only the invited email address can accept it." : "Add someone with an existing Kylro account by email."}</p>
            {action === "issue" && <label>Project<select required value={project} onChange={e => setProject(e.target.value)} disabled={busy}><option value="" disabled>Select a project</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>}
            <label>{action === "member" || action === "invite" ? "Email address" : action === "workspace" ? "Workspace name" : "Issue title"}<input required type={action === "member" || action === "invite" ? "email" : "text"} minLength={action === "workspace" ? 2 : 1} maxLength={action === "workspace" ? 50 : 200} value={name} disabled={busy} placeholder={action === "member" || action === "invite" ? "teammate@example.com" : action === "workspace" ? "e.g. Design studio" : "What needs to happen?"} onChange={e => { setName(e.target.value); if (action === "workspace") setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50)); }} /></label>
            {action === "workspace" && <label>Workspace slug<input required minLength={2} maxLength={50} pattern="[a-z0-9]+(-[a-z0-9]+)*" value={slug} onChange={e => setSlug(e.target.value)} disabled={busy} /><small>A unique name with lowercase letters, numbers, and hyphens.</small></label>}
            {(action === "member" || action === "invite") && <label>Workspace role<select value={role} onChange={e => setRole(e.target.value)} disabled={busy}><option value="member">Member — can create projects</option><option value="viewer">Viewer — cannot create projects</option>{data?.workspace.role === "owner" && <option value="admin">Admin — manages workspace and members</option>}</select><small>Roles inside individual projects are independent.</small></label>}
            {action === "issue" && <label>Description <span className="ws-muted">(optional)</span><textarea rows={4} maxLength={10000} value={description} disabled={busy} onChange={e => setDescription(e.target.value)} /></label>}
            {error && <p className="ws-error" role="alert">{error}</p>}
            {action === "issue" && !projects.length && <p>You need an editable project before creating an issue.</p>}
            <footer><button type="button" className="ws-button secondary" onClick={onClose} disabled={busy}>Cancel</button><button className="ws-button" disabled={busy || !name.trim() || (action === "issue" && !project)}>{busy ? "Saving…" : action === "member" ? "Add member" : action === "invite" ? "Send invitation" : action === "issue" ? "Create issue" : "Create workspace"}</button></footer>
        </form>
    </Modal>;
}
