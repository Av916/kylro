"use client";

import Link from "next/link";
import { ArrowRight, CheckCheck, CircleDot, ListTodo, Plus, Users, ArrowUpRight, CalendarDays } from "lucide-react";
import { dateLabel, issueKey, statuses, statusLabels } from "../../lib/project-api";
import { useProject } from "./ProjectProvider";
import { Avatar, EmptyState, PageHeading, StatusBadge } from "./ProjectUI";

export function OverviewView() {
    const { project, issues, members, canEdit, openIssue } = useProject();
    const base = `/projects/${project.id}`;
    const done = issues.filter(issue => issue.status === "done").length;
    const active = issues.filter(issue => issue.status === "in_progress").length;
    const percent = issues.length ? Math.round(done / issues.length * 100) : 0;
    const recent = [...issues].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)).slice(0, 5);
    const stats = [
        { label: "Total issues", value: issues.length, note: `${issues.filter(i => i.status === "todo").length} to do`, icon: ListTodo, href: `${base}/issues`, tone: "neutral" },
        { label: "In progress", value: active, note: `${issues.filter(i => i.status !== "done" && !i.assignedTo).length} open issues unassigned`, icon: CircleDot, href: `${base}/board`, tone: "amber" },
        { label: "Completed", value: done, note: `${percent}% of all issues`, icon: CheckCheck, href: `${base}/issues?status=done`, tone: "sage" },
        { label: "Team members", value: members.length, note: `${members.filter(m => m.role !== "viewer").length} can contribute`, icon: Users, href: `${base}/members`, tone: "purple" },
    ];
    return <div className="project-page">
        <PageHeading eyebrow="PROJECT OVERVIEW" title={project.name} description={`${issues.length - done} open issues · ${members.length} project members`} actions={<Link className="project-button secondary" href={`${base}/board`}>Open board <ArrowUpRight size={15} /></Link>} />
        <div className="project-hero-line"><span><CalendarDays size={14} /> Started {dateLabel(project.createdAt)}</span></div>
        <div className="project-stats">{stats.map(stat => <Link href={stat.href} className="project-stat" key={stat.label}><div className="project-stat-top"><span>{stat.label}</span><span className={`project-stat-icon ${stat.tone}`}><stat.icon size={19} strokeWidth={1.5} /></span></div><strong>{stat.value}</strong><p>{stat.note}</p></Link>)}</div>
        <div className="project-overview-grid"><div className="project-overview-primary">
            <section className="project-panel"><div className="project-section-heading"><div><h2>Recently updated issues</h2><p>Showing the latest saved issue changes.</p></div><Link href={`${base}/issues`} className="project-text-button">All issues <ArrowRight size={14} /></Link></div>
                {recent.length ? <div className="project-recent-list">{recent.map(issue => <button className="project-recent-issue" onClick={() => openIssue(issue)} key={issue.id}><span className={`project-status-dot ${issue.status}`} /><div><span className="project-issue-key">{issueKey(issue)}</span><strong>{issue.title}</strong></div><StatusBadge status={issue.status} /><ArrowUpRight size={16} /></button>)}</div> : <EmptyState title="No issues yet" action={canEdit ? <button className="project-button" onClick={() => openIssue()}><Plus size={15} /> Create your first issue</button> : undefined}>Create an issue to track work in this project.</EmptyState>}
            </section>
            <section className="project-panel"><div className="project-section-heading"><div><h2>Completion</h2><p>Based on current issue status.</p></div><span className="project-progress-total">{percent}<small>%</small></span></div><div className="project-progress-track" role="progressbar" aria-label="Issues completed" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${percent}%` }} /></div><div className="project-progress-legend">{statuses.map(status => <span key={status}><i className={`project-status-dot ${status}`} />{statusLabels[status]}<strong>{issues.filter(issue => issue.status === status).length}</strong></span>)}</div><p className="project-progress-note">{issues.length ? `${done} of ${issues.length} issues completed.` : "No issues to measure yet."}</p></section>
        </div><aside className="project-overview-aside">
            <section className="project-panel project-team-panel"><div className="project-section-heading"><h2>Project members</h2><span className="project-count">{members.length}</span></div>{members.slice(0, 4).map(member => <div className="project-team-person" key={member.userId}><Avatar name={member.name} /><div><strong>{member.name}</strong><span>{member.role}</span></div></div>)}<Link className="project-text-button" href={`${base}/members`}>View members <ArrowRight size={14} /></Link></section>
        </aside></div>
    </div>;
}
