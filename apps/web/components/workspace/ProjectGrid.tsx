"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProjectCard } from "./ProjectCard";
import { CreateProjectDialog } from "./CreateProjectDialog";

export function ProjectGrid({
  projects, workspaceId, onRefresh,
}: { projects: any[]; workspaceId: string; onRefresh: () => void }) {
  const [modal, setModal] = useState(false);

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-sketch text-[28px] font-medium" style={{ color: "var(--c-ink)" }}>
          Your Projects
        </h2>
        <Link href="/workspace#projects"
          className="flex items-center gap-1 text-[13px] font-medium transition-colors"
          style={{ color: "var(--c-ink-3)" }}>
          View all
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div onClick={() => setModal(true)}
          className="k-card-dashed flex flex-col items-center justify-center text-center"
          style={{ minHeight: 165, padding: 24 }}>
          <div className="flex items-center justify-center rounded-xl mb-3"
            style={{ width: 40, height: 40, border: "1.5px dashed var(--c-border)", color: "var(--c-ink-4)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </div>
          <p className="text-[14px] font-medium" style={{ color: "var(--c-ink-2)" }}>Create your first project</p>
          <p className="text-[13px] mt-1" style={{ color: "var(--c-ink-4)" }}>Organize issues, boards, and sprints.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 20 }}>
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}

          {/* New project tile */}
          <div onClick={() => setModal(true)}
            className="k-card-dashed group flex flex-col items-center justify-center text-center"
            style={{ minHeight: 165, padding: 24 }}>
            <div className="flex items-center justify-center rounded-xl mb-2 transition-colors"
              style={{ width: 36, height: 36, border: "1.5px dashed var(--c-ink-5)", color: "var(--c-ink-5)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
            <p className="text-[13px] font-medium" style={{ color: "var(--c-ink-4)" }}>New project</p>
            <p className="text-[12px] mt-0.5" style={{ color: "var(--c-ink-5)" }}>Start building something amazing.</p>
          </div>
        </div>
      )}

      {modal && (
        <CreateProjectDialog workspaceId={workspaceId} onClose={() => setModal(false)} onSuccess={onRefresh} />
      )}
    </section>
  );
}
