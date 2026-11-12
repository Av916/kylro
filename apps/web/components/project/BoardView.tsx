"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, GripVertical, ListTodo, Plus, Search } from "lucide-react";
import { errorMessage, issueKey, projectApi, statuses, statusLabels, type Issue, type IssueStatus } from "../../lib/project-api";
import { useProject } from "./ProjectProvider";
import { Avatar, PageHeading } from "./ProjectUI";

export function BoardView() {
    const { project, issues, members, canEdit, openIssue, saveIssue } = useProject();
    const [query, setQuery] = useState("");
    const [dragged, setDragged] = useState<string | null>(null);
    const [over, setOver] = useState<IssueStatus | null>(null);
    const [pending, setPending] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    async function move(issue: Issue, status: IssueStatus) {
        if (!canEdit || pending || issue.status === status) return;
        setPending(issue.id); setError(""); setNotice("");
        try { saveIssue(await projectApi.updateIssue(project.id, issue.id, { status })); setNotice(`Moved “${issue.title}” to ${statusLabels[status]}.`); }
        catch (error) { setError(errorMessage(error)); } finally { setPending(null); }
    }
    return <div className="project-page project-board-page"><PageHeading eyebrow={project.name} title="The project board" description={`${issues.length} issues · ${issues.filter(i => i.status === "in_progress").length} in progress`} actions={<Link className="project-button secondary" href={`/projects/${project.id}/issues`}><ListTodo size={16} /> List view</Link>} />
        <div className="project-board-toolbar"><div className="project-search-field"><Search size={16} /><input aria-label="Search board" placeholder="Find something on the board…" value={query} onChange={event => setQuery(event.target.value)} /></div><span className="project-muted">{canEdit ? "Drag a card or use its status menu to move it." : "You have view-only access to this board."}</span></div>
        {error && <p role="alert" className="project-error">{error}</p>}<p className="sr-only" role="status">{notice}</p>
        <div className="project-board">{statuses.map(status => { const cards = issues.filter(issue => issue.status === status && `${issue.title} ${issueKey(issue)}`.toLowerCase().includes(query.toLowerCase())); return <section key={status} aria-label={`${statusLabels[status]} column`} className={`project-board-column ${status}${over === status ? " drag-over" : ""}`} onDragOver={event => { if (canEdit && dragged) { event.preventDefault(); setOver(status); } }} onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOver(null); }} onDrop={event => { event.preventDefault(); const issue = issues.find(issue => issue.id === event.dataTransfer.getData("text/plain")); if (issue) void move(issue, status); setDragged(null); setOver(null); }}>
            <div className="project-column-heading"><h2><span className={`project-status-dot ${status}`} />{statusLabels[status]}<span>{cards.length}</span></h2>{canEdit && <button className="project-icon-button" aria-label={`Add issue to ${statusLabels[status]}`} onClick={() => openIssue(undefined, status)}><Plus size={17} /></button>}</div>
            <div className="project-board-cards">{cards.map(issue => { const assignee = members.find(member => member.userId === issue.assignedTo); return <article key={issue.id} draggable={canEdit && !pending} onDragStart={event => { event.dataTransfer.setData("text/plain", issue.id); event.dataTransfer.effectAllowed = "move"; setDragged(issue.id); }} onDragEnd={() => { setDragged(null); setOver(null); }} className={`project-board-card${dragged === issue.id ? " dragging" : ""}${pending === issue.id ? " saving" : ""}`}><div className="project-board-card-top"><span className="project-issue-key">{issueKey(issue)}</span>{canEdit && <GripVertical size={14} aria-hidden="true" />}</div><button className="project-board-card-title" onClick={() => openIssue(issue)}>{issue.title}<ArrowUpRight size={14} /></button>{issue.description && <p className="project-board-description">{issue.description}</p>}<div className="project-board-card-bottom">{canEdit ? <select aria-label={`Status for ${issue.title}`} value={issue.status} disabled={Boolean(pending)} onChange={event => void move(issue, event.target.value as IssueStatus)}>{statuses.map(status => <option key={status} value={status}>{statusLabels[status]}</option>)}</select> : <span className="project-muted">{statusLabels[issue.status]}</span>}{assignee ? <Avatar name={assignee.name} small /> : <span className="project-unassigned" title="Unassigned">—</span>}</div></article>; })}
            {!cards.length && <div className="project-board-empty"><p>{query ? "No matching issues" : `No ${statusLabels[status].toLowerCase()} issues`}</p></div>}
            </div>{canEdit && <button className="project-board-add" onClick={() => openIssue(undefined, status)}><Plus size={15} /> Add an issue</button>}
        </section>; })}</div>
    </div>;
}
