"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, ShieldCheck, Trash2, Users, UserRoundCheck, Eye } from "lucide-react";
import { dateLabel, errorMessage, projectApi, ProjectApiError, type MemberCandidate, type ProjectMember, type ProjectRole } from "../../lib/project-api";
import { useProject } from "./ProjectProvider";
import { Avatar, EmptyState, Modal, PageHeading } from "./ProjectUI";

type EditableRole = Exclude<ProjectRole, "owner">;
function AddMemberDialog({ onClose }: { onClose: () => void }) {
    const { project, refreshMembers } = useProject();
    const [candidates, setCandidates] = useState<MemberCandidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [attempt, setAttempt] = useState(0);
    const [userId, setUserId] = useState("");
    const [role, setRole] = useState<EditableRole>("member");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => {
        let active = true;
        projectApi.candidates(project.id).then(items => { if (active) { setCandidates(items); setError(""); } })
            .catch(error => { if (active) setError(errorMessage(error)); }).finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [project.id, attempt]);
    async function submit(event: FormEvent) {
        event.preventDefault(); setBusy(true); setError("");
        try { await projectApi.addMember(project.id, userId, role); await refreshMembers(); onClose(); }
        catch (error) { setError(errorMessage(error)); } finally { setBusy(false); }
    }
    return <Modal title="Good work is a team effort" onClose={onClose} busy={busy}><form className="project-issue-form" onSubmit={submit}><p className="project-muted">Add someone from your workspace to this project.</p>{loading ? <p role="status">Finding workspace members…</p> : candidates.length ? <><label className="project-field"><span>Workspace member</span><select aria-label="Workspace member" required value={userId} onChange={event => setUserId(event.target.value)} disabled={busy}><option value="">Choose a person…</option>{candidates.map(member => <option key={member.userId} value={member.userId}>{member.name} — {member.email}</option>)}</select></label><label className="project-field"><span>Project role</span><select aria-label="Project role" value={role} onChange={event => setRole(event.target.value as EditableRole)} disabled={busy}><option value="member">Member — work on issues</option><option value="admin">Admin — manage the project and team</option><option value="viewer">Viewer — view project work</option></select></label></> : !error && <div className="project-inline-note"><Users size={22} /><p>Everyone in this workspace is already part of the project. New people must join the workspace before they can be added here.</p></div>}{error && <div className="project-error" role="alert">{error}{!candidates.length && <button type="button" className="project-text-button" onClick={() => setAttempt(value => value + 1)}>Try again</button>}</div>}<div className="project-dialog-footer"><span /><div className="project-actions"><button type="button" className="project-button secondary" onClick={onClose} disabled={busy}>Cancel</button><button className="project-button" type="submit" disabled={busy || !userId || loading}>{busy ? "Adding…" : "Add to project"}</button></div></div></form></Modal>;
}

export function MembersView() {
    const { project, members, role, canManage, refreshMembers } = useProject();
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [adding, setAdding] = useState(false);
    const [removing, setRemoving] = useState<ProjectMember | null>(null);
    const [pending, setPending] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const filtered = members.filter(member => (roleFilter === "all" || member.role === roleFilter) && `${member.name} ${member.email}`.toLowerCase().includes(query.toLowerCase()));
    async function changeRole(member: ProjectMember, role: EditableRole) {
        setPending(member.userId); setError(""); setNotice("");
        try { await projectApi.changeRole(project.id, member.userId, role); await refreshMembers(); setNotice(`${member.name} is now a ${role}.`); }
        catch (error) { setError(errorMessage(error)); } finally { setPending(null); }
    }
    async function remove() {
        if (!removing) return;
        setPending(removing.userId); setError("");
        try { await projectApi.removeMember(project.id, removing.userId); await refreshMembers(); setNotice(`${removing.name} was removed from the project.`); setRemoving(null); }
        catch (error) { if (error instanceof ProjectApiError && error.status === 404) router.push("/workspace"); else setError(errorMessage(error)); } finally { setPending(null); }
    }
    return <div className="project-page"><PageHeading eyebrow={project.name} title="The project team" description={`${members.length} collaborators · Your role: ${role}`} actions={canManage ? <button className="project-button" onClick={() => setAdding(true)}><Plus size={16} /> Add member</button> : undefined} />
        {error && !removing && <p className="project-error" role="alert">{error}</p>}{notice && <p className="project-success" role="status">{notice}</p>}
        <div className="project-team-summary" aria-label="Team overview">
            {[{ label: "Collaborators", value: members.length, Icon: Users }, { label: "Can contribute", value: members.filter(m => m.role !== "viewer").length, Icon: UserRoundCheck }, { label: "View-only", value: members.filter(m => m.role === "viewer").length, Icon: Eye }].map(item => <div className="project-team-stat" key={item.label}><span className="project-stat-icon"><item.Icon size={18} strokeWidth={1.6} /></span><div><span>{item.label}</span><strong>{item.value}</strong></div></div>)}
        </div>
        <section className="project-panel project-members-panel"><div className="project-members-toolbar"><h2>All collaborators <span className="project-count">{members.length}</span></h2><div className="project-team-filters"><label className="project-search-field"><Search size={15} /><input aria-label="Search members" placeholder="Find a teammate…" value={query} onChange={event => setQuery(event.target.value)} /></label><select className="project-role-select" aria-label="Filter members by role" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}><option value="all">All roles</option><option value="owner">Owner</option><option value="admin">Admin</option><option value="member">Member</option><option value="viewer">Viewer</option></select></div></div>
            {filtered.length ? <div className="project-table-wrap"><table className="project-table"><thead><tr><th>Team member</th><th>Project role</th><th>Joined</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{filtered.map(member => <tr key={member.userId}><td><div className="project-member-identity"><Avatar name={member.name} /><div><strong>{member.name}</strong><span>{member.email}</span></div></div></td><td data-label="Project role">{canManage && member.role !== "owner" ? <select className="project-role-select" aria-label={`Role for ${member.name}`} value={member.role} disabled={Boolean(pending)} onChange={event => void changeRole(member, event.target.value as EditableRole)}><option value="admin">Admin</option><option value="member">Member</option><option value="viewer">Viewer</option></select> : <span className={`project-role-badge ${member.role}`}>{member.role === "owner" && <ShieldCheck size={13} />}{member.role}</span>}</td><td data-label="Joined" className="project-muted">{dateLabel(member.createdAt)}</td><td className="project-member-actions">{canManage && member.role !== "owner" && <button className="project-icon-button danger-text" disabled={Boolean(pending)} aria-label={`Remove ${member.name}`} onClick={() => { setError(""); setRemoving(member); }}><Trash2 size={16} /></button>}</td></tr>)}</tbody></table></div> : <EmptyState title="No teammates found" action={<button className="project-button secondary" onClick={() => { setQuery(""); setRoleFilter("all"); }}>Clear filters</button>}>Try another name, email, or role.</EmptyState>}
        <div className="project-table-footer"><span>{filtered.length} of {members.length} collaborators</span></div></section>        {adding && <AddMemberDialog onClose={() => setAdding(false)} />}{removing && <Modal title="Remove project member?" onClose={() => setRemoving(null)} busy={Boolean(pending)}><div className="project-issue-form"><p><strong>{removing.name}</strong> will lose access to this project. Their assigned issues will become unassigned. They will remain in the workspace.</p>{error && <p className="project-error" role="alert">{error}</p>}<div className="project-actions"><button className="project-button secondary" onClick={() => setRemoving(null)} disabled={Boolean(pending)}>Keep member</button><button className="project-button danger" onClick={remove} disabled={Boolean(pending)}>{pending ? "Removing…" : "Remove member"}</button></div></div></Modal>}
    </div>;
}
