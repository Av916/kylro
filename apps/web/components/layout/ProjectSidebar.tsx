"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, LayoutDashboard, ListTodo, Columns3, Users, Activity, Settings, ArrowUpRight, PanelLeftClose, X } from "lucide-react";
import { useProject } from "../project/ProjectProvider";

export function ProjectSidebar({ open, onClose, onCollapse }: { open: boolean; onClose: () => void; onCollapse: () => void }) {
    const pathname = usePathname();
    const { project, issues, members, role } = useProject();
    const base = `/projects/${project.id}`;
    const items = [
        { label: "Overview", href: base, icon: LayoutDashboard },
        { label: "Issues", href: `${base}/issues`, icon: ListTodo, count: issues.filter(issue => issue.status !== "done").length },
        { label: "Board", href: `${base}/board`, icon: Columns3 },
        { label: "Members", href: `${base}/members`, icon: Users, count: members.length },
        { label: "Activity", href: `${base}/activity`, icon: Activity },
    ];
    return <>
        {open && <button className="project-sidebar-backdrop" onClick={onClose} aria-label="Close navigation" />}
        <aside id="project-navigation" className={`project-sidebar${open ? " mobile-open" : ""}`}>
            <div className="project-sidebar-brand"><Link href="/workspace"><span className="project-brand-icon">k.</span><span>Kylro<span className="project-brand-caption">a little space to build.</span></span></Link><button className="project-icon-button project-desktop-collapse" onClick={onCollapse} aria-label="Collapse sidebar" title="Collapse sidebar"><PanelLeftClose size={17} /></button><button className="project-icon-button mobile-only" onClick={onClose} aria-label="Close navigation"><X size={19} /></button></div>
            <Link href="/workspace" className="project-back-link"><ArrowLeft size={14} /> Back to workspace</Link>
            <div className="project-switcher"><span className="project-monogram">{project.name[0]?.toUpperCase()}</span><div><strong>{project.name}</strong><span>Project workspace</span></div></div>
            <span className="project-nav-label">YOUR PROJECT</span>
            <nav aria-label="Project navigation">{items.map(item => <Link key={item.label} href={item.href} onClick={onClose} aria-current={pathname === item.href ? "page" : undefined} className={pathname === item.href ? "active" : ""}><item.icon size={18} strokeWidth={1.6} /><span>{item.label}</span>{item.count !== undefined && <span className="project-nav-count">{item.count}</span>}</Link>)}</nav>
            <div className="project-sidebar-bottom"><Link className={`project-settings-link${pathname.endsWith("/settings") ? " active" : ""}`} href={`${base}/settings`} onClick={onClose}><Settings size={17} /> Project settings</Link>
                <div className="project-sidebar-note"><svg viewBox="0 0 150 65" fill="none" aria-hidden="true"><path d="M8 57L37 24l17 19L80 8l23 32 16-15 23 32M68 25l12-17 12 17M29 34l8-10 9 11M4 61c40-4 92-3 142 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /><path d="M103 14l4-5M113 19l6-2M93 6V1" stroke="currentColor" strokeLinecap="round" /></svg><p>Small steps.<br />Remarkable things.</p></div>
                <div className="project-access"><span className="project-access-dot" /><span>{role === "viewer" ? "View-only access" : `${role.charAt(0).toUpperCase()}${role.slice(1)} access`}</span><ArrowUpRight size={13} /></div>
            </div>
        </aside>
    </>;
}
