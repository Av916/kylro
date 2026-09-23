"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  {
    name: "Overview", href: "/workspace",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>
      </svg>
    ),
  },
  {
    name: "Projects", href: "/workspace#projects",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>
      </svg>
    ),
  },
  {
    name: "Members", href: "/workspace#members",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    name: "Issues", href: "/workspace#issues",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/><path d="m9 12 2 2 4-4"/>
      </svg>
    ),
  },
  {
    name: "Settings", href: "/workspace#settings",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
  },
];

const WS_LIST = [
  { name: "Personal",  initial: "P" },
  { name: "Glazzarto", initial: "G" },
  { name: "Tosh Cafe", initial: "T" },
];

interface SidebarProps {
  workspace: any;
  open: boolean;
  onToggle: () => void;
}

export function Sidebar({ workspace, open, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const wsName   = workspace?.name ?? "Kylro Engineering";
  const wsInit   = wsName[0]!.toUpperCase();

  return (
    <aside
      className="hidden md:flex flex-col flex-shrink-0 select-none overflow-hidden paper-grain"
      style={{
        width: open ? 260 : 68,
        background: "var(--c-sidebar)",
        borderRight: "1px solid var(--c-border)",
        transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
        position: "relative",
        zIndex: 20,
      }}
    >
      {/* ── Brand + Toggle ── */}
      <div
        className="flex items-center flex-shrink-0"
        style={{
          height: 72,
          padding: open ? "0 20px 0 24px" : "0 0 0 0",
          justifyContent: open ? "space-between" : "center",
          borderBottom: "1px solid var(--c-border)",
        }}
      >
        {/* Brand — hidden when collapsed */}
        <div
          className="flex items-baseline gap-2 overflow-hidden"
          style={{
            opacity: open ? 1 : 0,
            width: open ? "auto" : 0,
            transition: "opacity 0.2s ease, width 0.25s ease",
            whiteSpace: "nowrap",
          }}
        >
          <span
            className="font-sketch leading-none"
            style={{ fontSize: 26, color: "var(--c-ink)", letterSpacing: "-0.02em" }}
          >
            Kylro
          </span>
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded-md"
            style={{ background: "var(--c-border)", color: "var(--c-ink-3)", fontFamily: "inherit" }}
          >
            beta
          </span>
        </div>

        {/* Toggle button */}
        <button
          onClick={onToggle}
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          className="flex items-center justify-center rounded-lg transition-all flex-shrink-0"
          style={{
            width: 32,
            height: 32,
            color: "var(--c-ink-3)",
            background: "transparent",
            border: "1px solid transparent",
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "var(--c-hover)";
            el.style.borderColor = "var(--c-border)";
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "transparent";
            el.style.borderColor = "transparent";
          }}
        >
          {/* Chevron icon — flips direction */}
          <svg
            width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{
              transform: open ? "rotate(0deg)" : "rotate(180deg)",
              transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden" style={{ padding: open ? "24px 12px" : "24px 8px" }}>

        {/* Workspace section */}
        <div style={{ marginBottom: 28 }}>
          {open && (
            <p
              className="text-[10px] font-semibold tracking-[0.1em] mb-2"
              style={{ color: "var(--c-ink-5)", paddingLeft: 12 }}
            >
              WORKSPACE
            </p>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {NAV.map((item) => {
              const active = item.href === "/workspace"
                ? pathname === "/workspace"
                : pathname.startsWith(item.href.split("#")[0]!) && item.href !== "/workspace";

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  title={!open ? item.name : undefined}
                  className="flex items-center rounded-[10px] transition-all"
                  style={{
                    height: 42,
                    gap: open ? 12 : 0,
                    padding: open
                      ? (active ? "0 12px 0 9px" : "0 12px")
                      : "0",
                    justifyContent: open ? "flex-start" : "center",
                    background: "transparent",
                    border: "none",
                    borderLeft: active ? "3px solid var(--c-accent)" : "3px solid transparent",
                    borderRadius: active ? "0 8px 8px 0" : "8px",
                    color: active ? "var(--c-ink)" : "var(--c-ink-3)",
                    fontWeight: active ? 500 : 400,
                    fontSize: 14,
                  }}
                >
                  <span
                    className="flex-shrink-0"
                    style={{ color: active ? "var(--c-accent)" : "var(--c-ink-4)" }}
                  >
                    {item.icon}
                  </span>
                  <span
                    style={{
                      opacity: open ? 1 : 0,
                      width: open ? "auto" : 0,
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      transition: "opacity 0.18s ease",
                    }}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Workspace switcher */}
        <div>
          {open && (
            <div className="flex items-center justify-between mb-2" style={{ paddingLeft: 12, paddingRight: 4 }}>
              <p className="text-[10px] font-semibold tracking-[0.1em]" style={{ color: "var(--c-ink-5)" }}>
                YOUR WORKSPACES
              </p>
              <button aria-label="Add workspace" style={{ color: "var(--c-ink-4)" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Active workspace */}
            <div
              title={!open ? wsName : undefined}
              className="flex items-center rounded-[10px]"
              style={{
                height: 42,
                gap: open ? 12 : 0,
                padding: open ? "0 12px" : "0",
                justifyContent: open ? "flex-start" : "center",
                background: "#E7E5DC",
                border: "1px solid #D0CCC1",
              }}
            >
              <div
                className="flex items-center justify-center rounded-md text-[11px] font-bold flex-shrink-0"
                style={{ width: 22, height: 22, background: "var(--c-ink)", color: "var(--c-card)" }}
              >
                {wsInit}
              </div>
              <span
                className="text-[13px] font-medium truncate"
                style={{
                  color: "var(--c-ink)",
                  opacity: open ? 1 : 0,
                  width: open ? "auto" : 0,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  transition: "opacity 0.18s ease",
                }}
              >
                {wsName}
              </span>
            </div>

            {WS_LIST.map((ws) => (
              <button
                key={ws.name}
                title={!open ? ws.name : undefined}
                className="flex items-center rounded-[10px] w-full transition-colors"
                style={{
                  height: 42,
                  gap: open ? 12 : 0,
                  padding: open ? "0 12px" : "0",
                  justifyContent: open ? "flex-start" : "center",
                  color: "var(--c-ink-3)",
                  background: "transparent",
                  border: "1px solid transparent",
                }}
              >
                <div
                  className="flex items-center justify-center rounded-md text-[11px] font-semibold flex-shrink-0"
                  style={{ width: 22, height: 22, border: "1px solid var(--c-border)", color: "var(--c-ink-2)", background: "transparent" }}
                >
                  {ws.initial}
                </div>
                <span
                  className="text-[13px] truncate"
                  style={{
                    opacity: open ? 1 : 0,
                    width: open ? "auto" : 0,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    transition: "opacity 0.18s ease",
                  }}
                >
                  {ws.name}
                </span>
              </button>
            ))}

            {/* New workspace */}
            <button
              title={!open ? "New Workspace" : undefined}
              className="flex items-center rounded-[10px] w-full transition-colors"
              style={{
                height: 42,
                gap: open ? 12 : 0,
                padding: open ? "0 12px" : "0",
                justifyContent: open ? "flex-start" : "center",
                color: "var(--c-ink-4)",
                background: "transparent",
                border: "1px solid transparent",
              }}
            >
              <div
                className="flex items-center justify-center rounded-md flex-shrink-0"
                style={{ width: 22, height: 22, border: "1.5px dashed var(--c-ink-5)", color: "var(--c-ink-5)" }}
              >
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </div>
              <span
                className="text-[13px]"
                style={{
                  opacity: open ? 1 : 0,
                  width: open ? "auto" : 0,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  transition: "opacity 0.18s ease",
                }}
              >
                New Workspace
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Bottom decoration — only when open ── */}
      {open && (
        <div
          className="px-6 pb-6 pt-5 flex flex-col items-center flex-shrink-0"
          style={{ borderTop: "1px solid var(--c-border)" }}
        >
          <svg width="100" height="48" viewBox="0 0 110 52" fill="none" style={{ opacity: 0.25, marginBottom: 8 }}>
            <path d="M2 52 L24 18 L38 30 L55 5 L72 22 L88 9 L108 52 Z"
              fill="none" stroke="var(--c-ink)" strokeWidth="1.4" strokeLinejoin="round"/>
            <path d="M50 11 L55 5 L60 11" fill="none" stroke="var(--c-ink)" strokeWidth="1" strokeLinecap="round"/>
            <path d="M82 18 L88 9 L94 18" fill="none" stroke="var(--c-ink)" strokeWidth="1" strokeLinecap="round"/>
          </svg>
          <p className="font-sketch text-[14px] text-center leading-tight" style={{ color: "var(--c-ink-5)" }}>
            &ldquo;Small progress builds big things.&rdquo;
          </p>
        </div>
      )}
    </aside>
  );
}
