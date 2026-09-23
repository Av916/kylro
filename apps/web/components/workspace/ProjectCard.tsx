"use client";

import React from "react";
import Link from "next/link";

// Deterministic icon per project index
const PROJECT_ICONS = [
    // Box / package
    <svg key="box" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>,
    // Monitor / web
    <svg key="monitor" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
    </svg>,
    // Leaf / mobile
    <svg key="leaf" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>,
    // Database / devops
    <svg key="db" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>,
    // Code
    <svg key="code" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
    </svg>,
];

const ACCENT_COLORS = [
    { icon: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
    { icon: "text-cyan-400",   bg: "bg-cyan-500/10",   border: "border-cyan-500/20"   },
    { icon: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
    { icon: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/20"  },
    { icon: "text-emerald-400",bg: "bg-emerald-500/10",border: "border-emerald-500/20"},
];

// Deterministic mock issue / member counts until API supports per-project stats
const MOCK_ISSUES   = [12, 8, 4, 3, 7, 5, 9, 2];
const MOCK_MEMBERS  = [4, 4, 2, 2, 3, 1, 5, 2];
const MOCK_DESC = [
    "Backend services, auth, and core infrastructure.",
    "Frontend application built with Next.js and Tailwind.",
    "Future mobile experience for Kylro.",
    "Deployment, CI/CD and infrastructure.",
    "Shared packages and design system.",
    "Documentation and developer portal.",
    "Analytics and reporting engine.",
    "Integration layer and third-party connectors.",
];

export function ProjectCard({
    project,
    index = 0,
}: {
    project: any;
    index?: number;
}) {
    const accent = ACCENT_COLORS[index % ACCENT_COLORS.length]!;
    const icon   = PROJECT_ICONS[index % PROJECT_ICONS.length]!;
    const issues  = MOCK_ISSUES[index % MOCK_ISSUES.length]!;
    const members = MOCK_MEMBERS[index % MOCK_MEMBERS.length]!;
    const desc    = project.description || MOCK_DESC[index % MOCK_DESC.length]!;

    return (
        <Link href={`/projects/${project.id}`} className="block group">
            <div className="studio-card p-5 h-full flex flex-col justify-between min-h-[140px] relative overflow-hidden transition-all duration-200 hover:border-zinc-700/70 hover:bg-zinc-800/30">
                {/* Three-dot menu */}
                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    className="absolute top-3.5 right-3.5 w-6 h-6 rounded flex items-center justify-center text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Project options"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="5"  cy="12" r="2" />
                        <circle cx="12" cy="12" r="2" />
                        <circle cx="19" cy="12" r="2" />
                    </svg>
                </button>

                {/* Top */}
                <div>
                    <div className="flex items-start gap-3 mb-2.5">
                        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${accent.icon} ${accent.bg} ${accent.border}`}>
                            {icon}
                        </div>
                        <div className="min-w-0 pt-0.5">
                            <h3 className="text-[14px] font-semibold text-zinc-100 leading-tight truncate group-hover:text-white transition-colors pr-6">
                                {project.name}
                            </h3>
                            <p className="text-[12px] text-zinc-500 mt-0.5 leading-snug line-clamp-2">
                                {desc}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer stats */}
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-zinc-800/70">
                    <span className="flex items-center gap-1.5 text-[12px] text-zinc-400">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="9" />
                            <path d="m9 12 2 2 4-4" />
                        </svg>
                        {issues} issues
                    </span>
                    <span className="flex items-center gap-1.5 text-[12px] text-zinc-400">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        {members} members
                    </span>
                </div>
            </div>
        </Link>
    );
}
