"use client";

import React from "react";

type Item = {
  id: string;
  type: "avatar" | "check" | "comment";
  text: string;
  detail?: string;
  time: string;
  initial?: string;
};

const ITEMS: Item[] = [
  { id: "1", type: "avatar", initial: "A", text: "You created a new project", detail: "Kylro API", time: "2h ago" },
  { id: "2", type: "check",  text: "Issue #24 marked as done", time: "4h ago" },
  { id: "3", type: "avatar", initial: "R", text: "Rohan joined the workspace", time: "6h ago" },
  { id: "4", type: "comment", text: "New comment on Project roadmap", time: "1d ago" },
];

function Dot({ item }: { item: Item }) {
  if (item.type === "avatar") {
    return (
      <div className="flex items-center justify-center rounded-full text-[11px] font-semibold flex-shrink-0 z-10"
        style={{ width: 28, height: 28, background: "var(--c-ink)", color: "var(--c-card)" }}>
        {item.initial}
      </div>
    );
  }
  if (item.type === "check") {
    return (
      <div className="flex items-center justify-center rounded-full flex-shrink-0 z-10"
        style={{ width: 28, height: 28, background: "var(--c-accent-soft)", border: "1px solid rgba(82,107,87,0.2)", color: "var(--c-accent)" }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9"/><path d="m9 12 2 2 4-4"/>
        </svg>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center rounded-full flex-shrink-0 z-10"
      style={{ width: 28, height: 28, background: "var(--c-hover)", border: "1px solid var(--c-border)", color: "var(--c-ink-3)" }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    </div>
  );
}

export function RecentActivity() {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[15px] font-semibold" style={{ color: "var(--c-ink)" }}>Recent Activity</h3>
        <button className="flex items-center gap-1 text-[12px]" style={{ color: "var(--c-ink-3)" }}>
          View all
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </div>

      {/* Timeline with vertical line */}
      <div className="relative">
        {/* Vertical connector line */}
        <div
          className="absolute top-4 bottom-4"
          style={{ left: 13, width: 1, background: "none", borderLeft: "1.5px dashed var(--c-border)" }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {ITEMS.map((item) => (
            <div key={item.id} className="flex items-start gap-4 relative">
              <Dot item={item} />
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-[13px] leading-snug" style={{ color: "var(--c-ink-2)" }}>
                  {item.text}
                  {item.detail && (
                    <span className="font-medium ml-1" style={{ color: "var(--c-ink)" }}>{item.detail}</span>
                  )}
                </p>
                <span className="text-[11px] mt-1 block font-mono" style={{ color: "var(--c-ink-4)" }}>
                  {item.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
