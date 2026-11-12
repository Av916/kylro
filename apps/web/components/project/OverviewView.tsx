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
        { label: "Total issues", value: issues.length, note: "Ideas, tasks & little to-dos", icon: ListTodo, href: `${base}/issues`, tone: "neutral" },
        { label: "In progress", value: active, note: "Good things in the making", icon: CircleDot, href: `${base}/board`, tone: "amber" },
        { label: "Completed", value: done, note: "One step closer, every day", icon: CheckCheck, href: `${base}/issues?status=done`, tone: "sage" },
        { label: "Team members", value: members.length, note: "Better when built together", icon: Users, href: `${base}/members`, tone: "purple" },
    ];
    return <div className="project-page">
        <PageHeading eyebrow="THE BIG PICTURE" title={project.name} description="A little clarity. A little progress. A space to build something that matters." actions={<Link className="project-button secondary" href={`${base}/board`}>Open board <ArrowUpRight size={15} /></Link>} />
        <div className="project-hero-line"><span><CalendarDays size={14} /> Started {dateLabel(project.createdAt)}</span><span className="project-handwritten">small steps, big ideas <svg viewBox="0 0 55 20" fill="none" aria-hidden="true"><path d="M2 3c10 16 29 14 47 5m-10-3 11 3-6 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg></span></div>
        <div className="project-stats">{stats.map(stat => <Link href={stat.href} className="project-stat" key={stat.label}><div className="project-stat-top"><span>{stat.label}</span><span className={`project-stat-icon ${stat.tone}`}><stat.icon size={19} strokeWidth={1.5} /></span></div><strong>{stat.value.toString().padStart(2, "0")}</strong><p>{stat.note}</p></Link>)}</div>
        <div className="project-overview-grid"><div className="project-overview-primary">
            <section className="project-panel"><div className="project-section-heading"><div><h2>On the drawing board</h2><p>The latest work, all in one place.</p></div><Link href={`${base}/issues`} className="project-text-button">All issues <ArrowRight size={14} /></Link></div>
                {recent.length ? <div className="project-recent-list">{recent.map(issue => <button className="project-recent-issue" onClick={() => openIssue(issue)} key={issue.id}><span className={`project-status-dot ${issue.status}`} /><div><span className="project-issue-key">{issueKey(issue)}</span><strong>{issue.title}</strong></div><StatusBadge status={issue.status} /><ArrowUpRight size={16} /></button>)}</div> : <EmptyState title="Every big idea starts small." action={canEdit ? <button className="project-button" onClick={() => openIssue()}><Plus size={15} /> Create your first issue</button> : undefined}>Turn your next idea into a task. This is where your project starts taking shape.</EmptyState>}
            </section>
            <section className="project-panel"><div className="project-section-heading"><div><h2>A little progress</h2><p>From the first idea to the final checkmark.</p></div><span className="project-progress-total">{percent}<small>%</small></span></div><div className="project-progress-track" role="progressbar" aria-label="Issues completed" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${percent}%` }} /></div><div className="project-progress-legend">{statuses.map(status => <span key={status}><i className={`project-status-dot ${status}`} />{statusLabels[status]}<strong>{issues.filter(issue => issue.status === status).length}</strong></span>)}</div><p className="project-progress-note">{issues.length ? `${done} of ${issues.length} issues completed. Keep the momentum going.` : "Your progress will grow with every issue you complete."}</p></section>
        </div><aside className="project-overview-aside">
            <section className="project-notebook"><span className="project-notebook-tape" aria-hidden="true" /><span className="project-eyebrow">A NOTE TO YOUR TEAM</span><h2>Make room<br />for good work.</h2><p>Big things are built one thoughtful step at a time. Pick a task, share an idea, and keep moving.</p><svg viewBox="0 0 235 88" fill="none" aria-hidden="true"><path d="M7 78l39-44 27 26 40-49 42 48 27-29 44 48M98 29l15-18 16 19M34 48l12-14 14 16M166 47l16-17 16 18M4 83c74-4 154-5 227-1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="182" cy="11" r="7" stroke="currentColor" /><path d="M41 80l-6-10M54 80l5-7M147 80l-5-8M155 80l5-9" stroke="currentColor" strokeWidth="1.1" /></svg><span className="project-handwritten">you’ve got this.</span></section>
            <section className="project-panel project-team-panel"><div className="project-section-heading"><h2>The people behind it</h2><span className="project-count">{members.length}</span></div>{members.slice(0, 4).map(member => <div className="project-team-person" key={member.userId}><Avatar name={member.name} /><div><strong>{member.name}</strong><span>{member.role}</span></div></div>)}<Link className="project-text-button" href={`${base}/members`}>Meet the team <ArrowRight size={14} /></Link></section>
        </aside></div>
        <footer className="project-page-footer"><span>A little more organized. A little closer to done.</span><span className="project-handwritten">Made for the way you build.</span></footer>
    </div>;
}
