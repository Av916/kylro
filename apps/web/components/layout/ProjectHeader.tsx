"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, PanelLeftClose, PanelLeftOpen, Plus, ChevronRight } from "lucide-react";
import { useProject } from "../project/ProjectProvider";
import { NotificationCenter } from "../workspace/NotificationCenter";
import { RefreshButton } from "./RefreshButton";
import { Avatar } from "../project/ProjectUI";

export function ProjectHeader({ onOpenNavigation, navigationOpen }: { onOpenNavigation: () => void; navigationOpen: boolean }) {
    const { project, members, canEdit, openIssue, refreshMembers } = useProject();
    const pathname = usePathname();
    const router = useRouter();
    const [query, setQuery] = useState("");
    const segment = pathname.split("/")[3] || "overview";
    const viewName = segment[0]!.toUpperCase() + segment.slice(1);
    function search(event: FormEvent) {
        event.preventDefault();
        router.push(`/projects/${project.id}/issues?q=${encodeURIComponent(query.trim())}`);
    }
    return <header className="project-header">
        <button id="project-sidebar-toggle" className="project-icon-button project-navigation-toggle" onClick={onOpenNavigation} aria-label={navigationOpen ? "Collapse project sidebar" : "Open project navigation"} title={navigationOpen ? "Collapse sidebar" : "Open sidebar"} aria-expanded={navigationOpen} aria-controls="project-navigation">{navigationOpen ? <PanelLeftClose size={19} /> : <PanelLeftOpen size={19} />}</button>
        <div className="project-breadcrumb"><Link href={`/projects/${project.id}`}>{project.name}</Link><ChevronRight size={13} /><span>{viewName}</span></div>
        <form className="project-header-search" onSubmit={search} role="search"><Search size={16} /><input aria-label="Search project issues" placeholder="Find an issue…" value={query} onChange={event => setQuery(event.target.value)} /><button type="submit" aria-label="Search issues"><span>↵</span></button></form>
        <RefreshButton refresh={refreshMembers} /><NotificationCenter />
        <Link href={`/projects/${project.id}/members`} className="project-header-team" aria-label={`View ${members.length} project members`}>{members.slice(0, 3).map(member => <Avatar key={member.userId} name={member.name} small />)}</Link>
        {canEdit && <button className="project-button project-header-create" onClick={() => openIssue()}><Plus size={16} /><span>New issue</span></button>}
    </header>;
}
