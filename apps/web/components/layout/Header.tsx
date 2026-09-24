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
            className="flex items-center rounded-xl transition-all"
            style={{
              height: 40,
              padding: "0 12px",
              gap: 10,
              background: open ? "var(--c-hover)" : "transparent",
              border: open ? "1px solid var(--c-border)" : "1px solid transparent",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "var(--c-hover)";
              el.style.borderColor = "var(--c-border)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              if (!open) {
                el.style.background = "transparent";
                el.style.borderColor = "transparent";
              }
            }}
          >
            <div className="flex items-center justify-center rounded-full text-[12px] font-semibold flex-shrink-0"
              style={{ width: 28, height: 28, background: "var(--c-ink)", color: "var(--c-card)" }}>
              {initial}
            </div>
            <span className="text-[14px] font-medium hidden sm:inline" style={{ color: "var(--c-ink)" }}>
              {firstName ?? "Account"}
            </span>
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                color: "var(--c-ink-4)",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}/>
              <div
                className="absolute right-0 mt-2.5 z-50 k-fade-in overflow-hidden"
                style={{
                  width: 270,
                  background: "var(--c-card)",
                  border: "1px solid var(--c-border)",
                  borderRadius: 16,
                  boxShadow: "0 12px 36px rgba(37,37,34,0.14), 0 2px 6px rgba(37,37,34,0.06)",
                }}
              >
                {/* User info card with generous padding */}
                <div
                  className="flex items-center gap-3.5"
                  style={{
                    padding: "16px 18px",
                    borderBottom: "1px solid var(--c-border)",
                    background: "rgba(0,0,0,0.015)",
                  }}
                >
                  <div
                    className="flex items-center justify-center rounded-full text-[13px] font-semibold flex-shrink-0"
                    style={{ width: 38, height: 38, background: "var(--c-ink)", color: "var(--c-card)" }}
                  >
                    {initial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold truncate leading-tight" style={{ color: "var(--c-ink)" }}>
                      {user?.name ?? "Developer"}
                    </p>
                    <p className="text-[12px] mt-1 truncate font-mono leading-none" style={{ color: "var(--c-ink-3)" }}>
                      {user?.email ?? "dev@kylro.app"}
                    </p>
                  </div>
                </div>

                {/* Navigation items with comfortable spacing and padding */}
                <div className="flex flex-col gap-1" style={{ padding: "8px 8px 10px 8px" }}>
                  <Link
                    href="/workspace#settings"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl transition-colors"
                    style={{
                      padding: "10px 14px",
                      fontSize: 14,
                      color: "var(--c-ink-2)",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--c-hover)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                      style={{ color: "var(--c-ink-3)", flexShrink: 0 }}>
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                    <span>Settings</span>
                  </Link>

                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl transition-colors"
                    style={{
                      padding: "10px 14px",
                      fontSize: 14,
                      color: "var(--c-ink-3)",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--c-hover)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                      style={{ color: "var(--c-ink-4)", flexShrink: 0 }}>
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    <span>Sign out</span>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
