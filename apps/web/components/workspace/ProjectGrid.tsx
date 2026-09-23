"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ProjectCard } from "./ProjectCard";
import { CreateProjectDialog } from "./CreateProjectDialog";

export function ProjectGrid({
    projects,
    workspaceId,
    onRefresh,
}: {
    projects: any[];
    workspaceId: string;
    onRefresh: () => void;
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section>
            {/* Header row */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[16px] font-bold text-zinc-100 tracking-tight">
                    Your Projects
                </h2>
                <Link
                    href="/workspace#projects"
                    className="flex items-center gap-1 text-[13px] text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                    View all
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                    </svg>
                </Link>
            </div>

            {/* Empty state */}
            {projects.length === 0 ? (
                <div
                    onClick={() => setIsModalOpen(true)}
                    className="studio-card-dashed p-10 flex flex-col items-center justify-center text-center cursor-pointer"
                >
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center mb-3 text-zinc-400">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    </div>
                    <p className="text-[14px] font-semibold text-zinc-300 mb-1">
                        Create your first project
                    </p>
                    <p className="text-[12px] text-zinc-500">
                        Organize issues, boards, and sprints in one place.
                    </p>
                </div>
            ) : (
                /* 2-column grid */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {projects.map((p, i) => (
                        <ProjectCard key={p.id} project={p} index={i} />
                    ))}

                    {/* "+" new project tile */}
                    <div
                        onClick={() => setIsModalOpen(true)}
                        className="studio-card-dashed p-5 min-h-[140px] flex flex-col items-center justify-center text-center group cursor-pointer"
                    >
                        <div className="w-8 h-8 rounded-lg bg-zinc-900/80 border border-zinc-700/70 flex items-center justify-center mb-2 text-zinc-500 group-hover:text-zinc-300 group-hover:border-zinc-600 transition-all">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                        </div>
                        <span className="text-[13px] font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors">
                            New project
                        </span>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <CreateProjectDialog
                    workspaceId={workspaceId}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={onRefresh}
                />
            )}
        </section>
    );
}
