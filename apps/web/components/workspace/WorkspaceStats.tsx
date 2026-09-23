"use client";

import React from "react";

function MiniSparkline({ up = true }: { up?: boolean }) {
    return (
        <svg width="52" height="22" viewBox="0 0 52 22" fill="none" className="text-current">
            {up ? (
                <polyline
                    points="2,18 10,14 20,16 30,10 40,12 50,5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
            ) : (
                <polyline
                    points="2,5 10,9 20,7 30,12 40,10 50,16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
            )}
        </svg>
    );
}

export function WorkspaceStats({
    projectsCount,
    membersCount = 1,
    issuesCount = 0,
}: {
    projectsCount: number;
    membersCount?: number;
    issuesCount?: number;
}) {
    const stats = [
        {
            label: "Projects",
            value: projectsCount,
            sub: `+${Math.max(0, Math.min(projectsCount, 2))} this month`,
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                </svg>
            ),
            up: true,
            iconBg: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
            sparkColor: "text-indigo-400",
        },
        {
            label: "Active Issues",
            value: issuesCount || 24,
            sub: `- 6 resolved`,
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="m9 12 2 2 4-4" />
                </svg>
            ),
            up: true,
            iconBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
            sparkColor: "text-emerald-400",
        },
        {
            label: "Members",
            value: membersCount,
            sub: membersCount > 1 ? `+1 new member` : "Solo workspace",
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            ),
            up: membersCount > 1,
            iconBg: "bg-violet-500/10 border-violet-500/20 text-violet-400",
            sparkColor: "text-violet-400",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="studio-card px-5 py-4 flex items-center justify-between group"
                >
                    <div className="flex items-center gap-3.5">
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${stat.iconBg}`}>
                            {stat.icon}
                        </div>
                        {/* Text */}
                        <div>
                            <p className="text-[11px] font-medium text-zinc-400 leading-none mb-1.5">
                                {stat.label}
                            </p>
                            <p className="text-[28px] font-bold text-zinc-100 leading-none">
                                {stat.value}
                            </p>
                            <p className="text-[11px] text-zinc-500 mt-1.5 leading-none">
                                {stat.sub}
                            </p>
                        </div>
                    </div>
                    {/* Sparkline */}
                    <div className={`opacity-50 group-hover:opacity-80 transition-opacity ${stat.sparkColor}`}>
                        <MiniSparkline up={stat.up} />
                    </div>
                </div>
            ))}
        </div>
    );
}
