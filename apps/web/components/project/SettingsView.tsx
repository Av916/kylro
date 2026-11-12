"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Check, FolderPen, ShieldCheck } from "lucide-react";
import { dateLabel, errorMessage, projectApi } from "../../lib/project-api";
import { useProject } from "./ProjectProvider";
import { Modal, PageHeading } from "./ProjectUI";

export function SettingsView() {
    const { project, role, canManage, setProject } = useProject();
    const [name, setName] = useState(project.name);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [saved, setSaved] = useState(false);
    async function submit(event: FormEvent) {
        event.preventDefault(); setBusy(true); setError(""); setSaved(false);
        try { const updated = await projectApi.rename(project.id, name.trim()); setProject(updated); setName(updated.name); setSaved(true); }
        catch (error) { setError(errorMessage(error)); } finally { setBusy(false); }
    }
    return <div className="project-page"><PageHeading eyebrow={project.name} title="Project settings" description={`Your role: ${role} · Last updated ${dateLabel(project.updatedAt)}`} /><div className="project-settings-grid"><section className="project-panel"><div className="project-section-heading"><div><h2><FolderPen size={18} /> General</h2><p>How your project appears across your workspace.</p></div></div><form onSubmit={submit} className="project-settings-form"><label className="project-field"><span>Project name</span><input aria-label="Project name" value={name} onChange={event => { setName(event.target.value); setSaved(false); }} minLength={2} maxLength={100} required disabled={!canManage || busy} /><small>2–100 characters.</small></label>{error && <p className="project-error" role="alert">{error}</p>}{saved && <p className="project-success" role="status"><Check size={15} /> Project name saved.</p>}{canManage ? <button type="submit" className="project-button" disabled={busy || name.trim().length < 2 || name.trim() === project.name}>{busy ? "Saving…" : "Save changes"}</button> : <p className="project-inline-note">Only the project owner and admins can change these settings.</p>}</form></section><aside className="project-panel project-settings-info"><ShieldCheck size={24} /><h2>Your project space</h2><dl><div><dt>Your role</dt><dd className="capitalize">{role}</dd></div><div><dt>Created</dt><dd>{dateLabel(project.createdAt)}</dd></div><div><dt>Last updated</dt><dd>{dateLabel(project.updatedAt)}</dd></div></dl><p className="project-muted">Manage collaborator roles from the Members view.</p></aside></div>{role === "owner" && <DeleteProject />}</div>;
}


function DeleteProject() {
    const { project } = useProject();
    const router = useRouter();
    const [open, setOpen] = useState(false), [confirmation, setConfirmation] = useState("");
    const [busy, setBusy] = useState(false), [error, setError] = useState("");
    async function remove() {
        setBusy(true); setError("");
        try { await projectApi.remove(project.id); router.replace("/workspace/projects"); }
        catch (err) { setError(errorMessage(err)); setBusy(false); }
    }
    return <section className="project-panel" style={{ marginTop: 24 }}><div className="project-section-heading"><div><h2>Delete project</h2><p>Permanently remove this project, its issues, and comments.</p></div></div><div className="project-settings-form"><button className="project-button secondary danger-text" onClick={() => setOpen(true)}>Delete project…</button></div>{open && <Modal title="Delete this project?" onClose={() => setOpen(false)} busy={busy}><div className="project-issue-form"><p>This permanently deletes <strong>{project.name}</strong> and all its issues and comments. This cannot be undone.</p><label className="project-field"><span>Type {project.name} to confirm</span><input value={confirmation} disabled={busy} onChange={e => setConfirmation(e.target.value)} /></label>{error && <p className="project-error" role="alert">{error}</p>}<footer className="project-dialog-footer"><button className="project-button secondary" disabled={busy} onClick={() => setOpen(false)}>Cancel</button><button className="project-button danger-text" disabled={busy || confirmation !== project.name} onClick={() => void remove()}>{busy ? "Deleting…" : "Permanently delete"}</button></footer></div></Modal>}</section>;
}
