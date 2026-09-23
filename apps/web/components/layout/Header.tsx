"use client";

import React, { useState } from "react";
import Link from "next/link";

export function Header({ user, workspace }: { user?: any; workspace?: any }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const firstName = user?.name ? user.name.split(" ")[0] : null;
    const initial = firstName
        ? firstName[0]!.toUpperCase()
        : user?.email
        ? user.email[0]!.toUpperCase()
        : "U";

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between h-12 px-5 md:px-6 bg-[#09090b]/90 backdrop-blur-xl border-b border-zinc-800/70 select-none flex-shrink-0">
            {/* ── Center: Search Bar ── */}
            <div className="flex-1 max-w-[480px] mx-auto">
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-zinc-800/80 bg-zinc-900/60 hover:border-zinc-700 transition-all focus-within:border-zinc-600 focus-within:bg-zinc-900">
                    <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-zinc-500 flex-shrink-0"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search projects, issues, members..."
                        className="bg-transparent border-none outline-none text-[12px] text-zinc-300 placeholder-zinc-500 flex-1 min-w-0"
                    />
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <kbd className="text-[10px] text-zinc-500 font-mono bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700/60 leading-none">
                            Ctrl
                        </kbd>
                        <kbd className="text-[10px] text-zinc-500 font-mono bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700/60 leading-none">
                            K
                        </kbd>
                    </div>
                </div>
            </div>

            {/* ── Right Actions ── */}
            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                {/* Notifications */}
                <button
                    className="relative w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-200 transition-colors"
                    aria-label="Notifications"
                >
                    <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 ring-[1.5px] ring-[#09090b]" />
                </button>

                {/* User profile */}
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-zinc-800/70 transition-all cursor-pointer"
                    >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 text-white text-[11px] font-bold flex items-center justify-center shadow-xs ring-1 ring-white/10">
                            {initial}
                        </div>
                        <span className="text-[13px] font-medium text-zinc-200 hidden sm:inline">
                            {firstName || "Account"}
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
                            className="text-zinc-500"
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </button>

                    {dropdownOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setDropdownOpen(false)}
                            />
                            <div className="absolute right-0 mt-1.5 w-52 py-1 studio-card bg-zinc-900 border border-zinc-800 shadow-2xl z-50 studio-fade-in overflow-hidden">
                                <div className="px-3 py-2.5 border-b border-zinc-800/80 mb-1">
                                    <p className="text-[12px] font-semibold text-zinc-100 truncate">
                                        {user?.name || "Developer"}
                                    </p>
                                    <p className="text-[11px] text-zinc-400 truncate font-mono mt-0.5">
                                        {user?.email || "dev@kylro.app"}
                                    </p>
                                </div>
                                <Link
                                    href="/workspace#settings"
                                    onClick={() => setDropdownOpen(false)}
                                    className="flex items-center gap-2 px-3 py-1.5 text-[12px] text-zinc-300 hover:bg-zinc-800/80 hover:text-white transition-colors"
                                >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                                    </svg>
                                    Workspace Settings
                                </Link>
                                <Link
                                    href="/login"
                                    onClick={() => setDropdownOpen(false)}
                                    className="flex items-center gap-2 px-3 py-1.5 text-[12px] text-rose-400 hover:bg-rose-500/10 transition-colors"
                                >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                        <polyline points="16 17 21 12 16 7" />
                                        <line x1="21" y1="12" x2="9" y2="12" />
                                    </svg>
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
