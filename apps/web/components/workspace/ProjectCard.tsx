"use client";

import React from "react";
import Link from "next/link";

const ICONS = [
  <svg key="cube" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>,
  <svg key="mon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/>
    <line x1="8" y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
  </svg>,
  <svg key="leaf" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>,
  <svg key="db" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"/>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
  </svg>,
  <svg key="code" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"/>
    <polyline points="8 6 2 12 8 18"/>
  </svg>,
];

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
  "Integration layer and connectors.",
];

export function ProjectCard({ project, index = 0 }: { project: any; index?: number }) {
  const icon    = ICONS[index % ICONS.length]!;
  const issues  = MOCK_ISSUES[index % MOCK_ISSUES.length]!;
  const members = MOCK_MEMBERS[index % MOCK_MEMBERS.length]!;
  const desc    = project.description || MOCK_DESC[index % MOCK_DESC.length]!;

  return (
    <Link href={`/projects/${project.id}`} className="block group">
      <div
        className="k-card-lift paper-grain relative overflow-hidden flex flex-col justify-between"
        style={{ padding: 24, minHeight: 165 }}
      >
        {/* Three-dot — visible on hover */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          className="absolute top-4 right-4 flex items-center justify-center rounded-md transition-all opacity-0 group-hover:opacity-100"
          style={{ width: 24, height: 24, color: "var(--c-ink-4)" }}
          aria-label="Options"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/>
          </svg>
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 pr-6">
          <div className="k-icon-box flex-shrink-0">{icon}</div>
          <div className="min-w-0">
            <h3 className="text-[15px] font-semibold leading-snug" style={{ color: "var(--c-ink)" }}>
              {project.name}
            </h3>
            <p className="text-[13px] mt-1 leading-relaxed line-clamp-2" style={{ color: "var(--c-ink-3)" }}>
              {desc}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-5 pt-4 mt-4" style={{ borderTop: "1px solid var(--c-border)" }}>
          <span className="flex items-center gap-1.5 text-[12px]" style={{ color: "var(--c-ink-3)" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--c-ink-4)" }}>
              <circle cx="12" cy="12" r="9"/><path d="m9 12 2 2 4-4"/>
            </svg>
            {issues} issues
          </span>
          <span className="flex items-center gap-1.5 text-[12px]" style={{ color: "var(--c-ink-3)" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--c-ink-4)" }}>
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            {members} members
          </span>
        </div>
      </div>
    </Link>
  );
}
