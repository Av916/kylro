"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function ProjectHeader({ project }: { project: any }) {
    const pathname = usePathname();
    
    let viewName = "Overview";
    if (pathname.includes("/issues")) viewName = "Issues";
    else if (pathname.includes("/board")) viewName = "Board";
    else if (pathname.includes("/members")) viewName = "Members";
    else if (pathname.includes("/activity")) viewName = "Activity";

    return (
        <header className="flex items-center justify-between py-3 px-6 bg-[var(--paper-card)] border-b-[1.5px] border-[var(--pencil)] select-none">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[12px]">
                <Link href="/workspace" className="text-[var(--ink-faint)] hover:text-[var(--ink)] transition-colors font-medium">
                    Workspace
                </Link>
                <span className="text-[var(--ink-ghost)]">/</span>
                <span className="font-semibold text-[var(--ink-dark)]">{project?.name || "Project"}</span>
                <span className="text-[var(--ink-ghost)]">/</span>
                <span className="text-[var(--ink-faint)]">{viewName}</span>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2">
                <button className="sketch-icon-btn" aria-label="Search">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </button>
                <button className="sketch-icon-btn" aria-label="Notifications">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                </button>
            </div>
        </header>
    );
}
