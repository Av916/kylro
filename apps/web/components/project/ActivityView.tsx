"use client";

import { useState } from "react";
import { CirclePlus, Pencil, Users, FolderOpen } from "lucide-react";
import { dateLabel, issueKey } from "../../lib/project-api";
import { useProject } from "./ProjectProvider";
import { PageHeading } from "./ProjectUI";

export function ActivityView() {
    const { project, issues, members, openIssue } = useProject();
    const [filter, setFilter] = useState("all");
    const events = [
        { id: "project", kind: "project", title: "A new project took shape", detail: project.name, date: project.createdAt, icon: FolderOpen, issue: undefined },
        ...(project.updatedAt !== project.createdAt ? [{ id: "project-update", kind: "project", title: "Project details updated", detail: project.name, date: project.updatedAt, icon: Pencil, issue: undefined }] : []),
        ...members.map(member => ({ id: `member-${member.userId}`, kind: "team", title: `${member.name} joined the project`, detail: `Part of the team · ${member.role}`, date: member.createdAt, icon: Users, issue: undefined })),
        ...issues.flatMap(issue => [
            { id: `created-${issue.id}`, kind: "issues", title: "An idea became an issue", detail: `${issueKey(issue)} · ${issue.title}`, date: issue.createdAt, icon: CirclePlus, issue },
            ...(issue.updatedAt !== issue.createdAt ? [{ id: `updated-${issue.id}`, kind: "issues", title: "An issue moved forward", detail: `${issueKey(issue)} · ${issue.title}`, date: issue.updatedAt, icon: Pencil, issue }] : []),
        ]),
    ].filter(event => filter === "all" || event.kind === filter).sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
    return <div className="project-page"><PageHeading eyebrow="THE STORY SO FAR" title="A trail of small steps" description="See when work began and the latest updates across your project." /><section className="project-panel project-activity-panel"><div className="project-tabs" role="group" aria-label="Filter activity">{[{ id: "all", label: "Everything" }, { id: "issues", label: "Issues" }, { id: "team", label: "Team" }, { id: "project", label: "Project" }].map(item => <button key={item.id} className={filter === item.id ? "selected" : ""} aria-pressed={filter === item.id} onClick={() => setFilter(item.id)}>{item.label}</button>)}</div><div className="project-timeline">{events.length ? events.map(event => <article className="project-timeline-event" key={event.id}><div className={`project-timeline-icon ${event.kind}`}><event.icon size={17} strokeWidth={1.6} /></div><div><h3>{event.title}</h3>{event.issue ? <button onClick={() => openIssue(event.issue)}>{event.detail}</button> : <p>{event.detail}</p>}<time dateTime={event.date}>{dateLabel(event.date)} · {new Date(event.date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</time></div></article>) : <p className="project-muted">Nothing here yet. Your next step will start the story.</p>}</div><div className="project-table-footer"><span>Showing creation dates and the latest saved updates.</span></div></section></div>;
}
