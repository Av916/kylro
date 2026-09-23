"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const WORKSPACE_NAV = [
    {
        name: "Overview",
        href: "/workspace",
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
            </svg>
        ),
    },
    {
        name: "Projects",
        href: "/workspace#projects",
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
            </svg>
        ),
    },
    {
        name: "Members",
        href: "/workspace#members",
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
    },
    {
        name: "Issues",
        href: "/workspace#issues",
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="m9 12 2 2 4-4" />
            </svg>
        ),
    },
    {
        name: "Settings",
        href: "/workspace#settings",
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
        ),
    },
];

// Mock workspaces to show multi-workspace switcher like the wireframe
const MOCK_OTHER_WORKSPACES = [
    { name: "Personal", initial: "P", color: "from-violet-500 to-purple-600" },
    { name: "Glazzarto", initial: "G", color: "from-emerald-500 to-teal-600" },
    { name: "Tosh Cafe", initial: "T", color: "from-amber-500 to-orange-600" },
];

export function Sidebar({ workspace }: { workspace: any }) {
    const pathname = usePathname();
    const [wsExpanded, setWsExpanded] = useState(false);

    const wsName = workspace?.name || "Kylro";
    const wsInitial = wsName.charAt(0).toUpperCase();

    return (
        <aside className="w-[220px] bg-[#0c0c10] border-r border-zinc-800/70 flex flex-col h-screen flex-shrink-0 hidden md:flex select-none z-20">
            {/* ── Brand ── */}
            <div className="px-5 pt-5 pb-4 border-b border-zinc-800/50">
                <div className="flex items-center gap-2.5 mb-0.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-500/20 ring-1 ring-white/15 flex-shrink-0">
                        K
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[15px] text-zinc-100 tracking-tight leading-none">
                                Kylro
                            </span>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 leading-none">
                                beta
                            </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 mt-0.5 leading-tight">
                            Build together. Make it real.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Workspace Nav ── */}
            <nav className="flex-1 overflow-y-auto py-4 space-y-5">
                {/* Section: Workspace */}
                <div className="px-3">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 px-2 mb-2">
                        Workspace
                    </p>
                    <div className="space-y-0.5">
                        {WORKSPACE_NAV.map((item) => {
                            const isActive =
                                item.href === "/workspace"
                                    ? pathname === "/workspace"
                                    : pathname.startsWith(item.href.split("#")[0]!) && item.href !== "/workspace";
                            const isOverview = item.href === "/workspace" && pathname === "/workspace";

                            const active = isOverview || (item.href !== "/workspace" && pathname === item.href.split("#")[0]);

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all ${
                                        item.name === "Overview" && pathname === "/workspace"
                                            ? "bg-zinc-800/80 text-zinc-100 font-medium"
                                            : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
                                    }`}
                                >
                                    <span
                                        className={
                                            item.name === "Overview" && pathname === "/workspace"
                                                ? "text-zinc-200"
                                                : "text-zinc-500"
                                        }
                                    >
                                        {item.icon}
                                    </span>
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Section: Your Workspaces */}
                <div className="px-3">
                    <div className="flex items-center justify-between px-2 mb-2">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                            Your Workspaces
                        </p>
                        <button
                            className="w-4 h-4 rounded flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 transition-colors"
                            aria-label="Add workspace"
                        >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-0.5">
                        {/* Current workspace — active */}
                        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-zinc-800/60 text-zinc-100">
                            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500 to-cyan-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                                {wsInitial}
                            </div>
                            <span className="text-[13px] font-medium truncate">{wsName}</span>
                        </div>

                        {/* Other workspaces */}
                        {MOCK_OTHER_WORKSPACES.map((ws) => (
                            <button
                                key={ws.name}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200 transition-all text-[13px]"
                            >
                                <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${ws.color} text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0`}>
                                    {ws.initial}
                                </div>
                                <span className="truncate">{ws.name}</span>
                            </button>
                        ))}

                        {/* New workspace */}
                        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-500 hover:bg-zinc-800/40 hover:text-zinc-300 transition-all text-[13px]">
                            <div className="w-5 h-5 rounded-md border border-dashed border-zinc-600 flex items-center justify-center flex-shrink-0">
                                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                            </div>
                            <span>New Workspace</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── Bottom illustration area ── */}
            <div className="px-5 pb-5 pt-4 border-t border-zinc-800/50">
                {/* Mountain illustration (SVG) */}
                <div className="flex justify-center mb-2 opacity-25">
                    <svg width="90" height="44" viewBox="0 0 90 44" fill="none">
                        <path d="M0 44 L20 18 L32 28 L45 8 L58 22 L70 12 L90 44 Z" fill="currentColor" className="text-zinc-400" />
                        <path d="M40 44 L55 20 L70 32 L90 10 L90 44 Z" fill="currentColor" className="text-zinc-600" opacity="0.6" />
                    </svg>
                </div>
                <p className="text-[10px] text-zinc-500 text-center italic leading-tight">
                    "Small progress builds big things."
                </p>
            </div>
        </aside>
    );
}
