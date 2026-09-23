"use client";

import React from "react";

function Sparkline({ up }: { up: boolean }) {
  return (
    <svg width="60" height="28" viewBox="0 0 60 28" fill="none">
      {up ? (
        <polyline points="2,24 14,17 26,20 38,11 50,14 58,5"
          stroke="var(--c-ink-4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <polyline points="2,5 14,10 26,7 38,16 50,12 58,22"
          stroke="var(--c-ink-4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

const STATS = [
  {
    label: "Projects",
    getValue: (p: number) => p || 3,
    trend: "+2 this month",
    up: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>
      </svg>
    ),
  },
  {
    label: "Active Issues",
    getValue: (_p: number, i: number) => i || 24,
    trend: "–6 resolved",
    up: false,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/><path d="m9 12 2 2 4-4"/>
      </svg>
    ),
  },
  {
    label: "Members",
    getValue: (_p: number, _i: number, m: number) => m || 1,
    trend: "+1 new member",
    up: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
];

export function WorkspaceStats({
  projectsCount,
  membersCount = 1,
  issuesCount = 0,
}: {
  projectsCount: number;
  membersCount?: number;
  issuesCount?: number;
}) {
  const values = [
    STATS[0]!.getValue(projectsCount, 0, 0),
    STATS[1]!.getValue(0, issuesCount, 0),
    STATS[2]!.getValue(0, 0, membersCount),
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 20 }}>
      {STATS.map((stat, i) => (
        <div
          key={stat.label}
          className="k-card"
          style={{ padding: 24, height: 150, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
        >
          {/* Top row: icon + label + sparkline */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="k-icon-box">{stat.icon}</div>
              <span className="text-[13px] font-medium" style={{ color: "var(--c-ink-3)" }}>
                {stat.label}
              </span>
            </div>
            <Sparkline up={stat.up} />
          </div>

          {/* Bottom: big number + trend */}
          <div>
            <p className="font-sketch leading-none" style={{ fontSize: 44, color: "var(--c-ink)", fontWeight: 500 }}>
              {values[i]}
            </p>
            <p className="text-[12px] mt-1 font-mono" style={{ color: "var(--c-ink-4)" }}>
              {stat.trend}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
