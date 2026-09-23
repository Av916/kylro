"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function ProjectSidebar({ project, projectId }: { project: any, projectId: string }) {
    const pathname = usePathname();

    const navItems = [
        { 
            name: "Overview", href: `/projects/${projectId}`,
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></svg>
        },
        { 
            name: "Issues", href: `/projects/${projectId}/issues`,
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="m9 12 2 2 4-4" /></svg>
        },
        { 
            name: "Board", href: `/projects/${projectId}/board`,
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="4" height="18" rx="1" /><rect x="10" y="3" width="4" height="12" rx="1" /><rect x="16" y="3" width="4" height="15" rx="1" /></svg>
        },
        { 
            name: "Members", href: `/projects/${projectId}/members`,
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
        },
        { 
            name: "Activity", href: `/projects/${projectId}/activity`,
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
        },
    ];

    const initial = project?.name ? project.name.charAt(0).toUpperCase() : "P";

    return (
        <aside className="w-[256px] bg-[var(--paper-card)] flex flex-col h-screen flex-shrink-0 hidden md:flex select-none border-r-[1.5px] border-[var(--pencil)]">
            {/* Back + Project Context */}
            <div className="px-4 pt-5 pb-1">
                <Link 
                    href="/workspace" 
                    className="text-[var(--ink-faint)] hover:text-[var(--ink)] text-[12px] font-medium flex items-center gap-1.5 w-fit transition-colors mb-4 group"
                >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    <span>All Projects</span>
                </Link>

                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border-[1.5px] border-[var(--pencil)] bg-[var(--paper-warm)] shadow-[1px_1px_0px_rgba(60,58,54,0.04)]">
                    <div className="w-7 h-7 rounded-lg bg-[var(--sage)] text-white font-bold text-[11px] flex items-center justify-center flex-shrink-0 shadow-[1px_1px_0px_rgba(0,0,0,0.08)]">
                        {initial}
                    </div>
                    <div className="min-w-0">
                        <h2 className="font-semibold text-[13px] text-[var(--ink-dark)] leading-tight truncate">
                            {project?.name || "Loading…"}
                        </h2>
                        <span className="text-[10px] uppercase tracking-widest text-[var(--ink-faint)] font-semibold block">
                            Project
                        </span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 mt-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--ink-faint)] mb-2 px-3">Views</p>
                <div className="space-y-0.5">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link 
                                key={item.name} 
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-[9px] rounded-xl text-[13px] transition-all duration-150 ${
                                    isActive 
                                    ? "bg-[var(--paper-warm)] text-[var(--ink-dark)] font-semibold border-[1.5px] border-[var(--pencil)] shadow-[1px_1px_0px_rgba(60,58,54,0.04)]" 
                                    : "text-[var(--ink-muted)] hover:bg-[var(--paper-hover)] hover:text-[var(--ink)] border-[1.5px] border-transparent"
                                }`}
                            >
                                <span className={isActive ? "text-[var(--ink-dark)]" : "text-[var(--ink-faint)]"}>{item.icon}</span>
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Bottom */}
            <div className="px-3 pb-4">
                <div className="pencil-divider mx-2 mb-3"></div>
                <Link 
                    href="#settings" 
                    className="flex items-center gap-3 px-3 py-[9px] rounded-xl text-[13px] text-[var(--ink-muted)] hover:bg-[var(--paper-hover)] hover:text-[var(--ink)] transition-colors border-[1.5px] border-transparent"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    </svg>
                    <span>Project settings</span>
                </Link>
                <div className="px-3 py-2 mt-1">
                    <span className="font-hand text-[14px] text-[var(--ink-ghost)] italic">Pencil &amp; Paper</span>
                    <span className="text-[10px] text-[var(--ink-ghost)] font-mono ml-2">#{projectId.slice(0, 6)}</span>
                </div>
            </div>
        </aside>
    );
}
