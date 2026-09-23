"use client";

import React, { useState } from "react";
import Link from "next/link";

interface HeaderProps {
  user?: any;
  workspace?: any;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export function Header({ user, workspace, sidebarOpen, onToggleSidebar }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const firstName = user?.name?.split(" ")[0] ?? null;
  const initial   = (firstName ?? user?.email ?? "U")[0]!.toUpperCase();

  return (
    <header
      className="flex-shrink-0 flex items-center select-none"
      style={{
        height: 72,
        padding: "0 24px 0 16px",
        gap: 12,
        background: "var(--c-header)",
        borderBottom: "1px solid var(--c-border)",
      }}
    >
      {/* ── Sidebar toggle (shown when sidebar is present) ── */}
      {onToggleSidebar && (
        <button
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          className="hidden md:flex items-center justify-center rounded-lg flex-shrink-0 transition-all"
          style={{
            width: 34,
            height: 34,
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
          {/* Hamburger → becomes X-ish lines when open */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6"  x2="21" y2="6"  />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      )}

      {/* ── Search bar (centred between toggle and actions) ── */}
      <div className="flex-1 flex justify-center">
        <div
          className="flex items-center w-full"
          style={{
            maxWidth: 520,
            height: 42,
            padding: "0 14px",
            gap: 10,
            background: "#F8F6F0",
            border: "1px solid var(--c-border)",
            borderRadius: 11,
            transition: "border-color 0.15s, box-shadow 0.15s",
          }}
          onFocus={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = "var(--c-border-2)";
            el.style.boxShadow = "0 0 0 3px rgba(82,107,87,0.08)";
          }}
          onBlur={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = "var(--c-border)";
            el.style.boxShadow = "none";
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            style={{ color: "var(--c-ink-4)", flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>

          <input
            type="text"
            placeholder="Search projects, issues, members..."
            className="flex-1 min-w-0 bg-transparent outline-none border-none"
            style={{ fontSize: 14, color: "var(--c-ink)", fontFamily: "inherit", lineHeight: 1 }}
          />

          <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
            <kbd className="text-[11px] font-mono leading-none"
              style={{ padding: "3px 6px", borderRadius: 6, background: "var(--c-card)", color: "var(--c-ink-4)", border: "1px solid var(--c-border)" }}>
              Ctrl
            </kbd>
            <kbd className="text-[11px] font-mono leading-none"
              style={{ padding: "3px 6px", borderRadius: 6, background: "var(--c-card)", color: "var(--c-ink-4)", border: "1px solid var(--c-border)" }}>
              K
            </kbd>
          </div>
        </div>
      </div>

      {/* ── Right actions ── */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Bell */}
        <button
          className="relative flex items-center justify-center rounded-lg transition-colors"
          style={{ width: 36, height: 36, color: "var(--c-ink-3)" }}
          aria-label="Notifications"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span className="absolute rounded-full"
            style={{ top: 7, right: 7, width: 7, height: 7, background: "var(--c-accent)", border: "2px solid var(--c-header)" }}/>
        </button>

        {/* Divider */}
        <div className="hidden sm:block flex-shrink-0"
          style={{ width: 1, height: 20, background: "var(--c-border)" }}/>

        {/* User */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 rounded-xl transition-colors"
            style={{ height: 38, padding: "0 10px", background: "transparent", border: "1px solid transparent" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--c-hover)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            <div className="flex items-center justify-center rounded-full text-[12px] font-semibold flex-shrink-0"
              style={{ width: 28, height: 28, background: "var(--c-ink)", color: "var(--c-card)" }}>
              {initial}
            </div>
            <span className="text-[14px] font-medium hidden sm:inline" style={{ color: "var(--c-ink)" }}>
              {firstName ?? "Account"}
            </span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--c-ink-4)" }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}/>
              <div
                className="absolute right-0 mt-1.5 w-52 py-1.5 z-50 k-fade-in"
                style={{
                  background: "var(--c-card)",
                  border: "1px solid var(--c-border)",
                  borderRadius: 12,
                  boxShadow: "0 8px 28px rgba(37,37,34,0.12)",
                }}
              >
                <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--c-border)" }}>
                  <p className="text-[13px] font-semibold truncate" style={{ color: "var(--c-ink)" }}>
                    {user?.name ?? "Developer"}
                  </p>
                  <p className="text-[12px] mt-0.5 truncate font-mono" style={{ color: "var(--c-ink-3)" }}>
                    {user?.email ?? "dev@kylro.app"}
                  </p>
                </div>
                <Link href="/workspace#settings" onClick={() => setOpen(false)}
                  className="flex items-center px-4 py-2.5 text-[13px] transition-colors"
                  style={{ color: "var(--c-ink-2)" }}>
                  Settings
                </Link>
                <Link href="/login" onClick={() => setOpen(false)}
                  className="flex items-center px-4 py-2.5 text-[13px] transition-colors"
                  style={{ color: "var(--c-ink-3)" }}>
                  Sign out
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
