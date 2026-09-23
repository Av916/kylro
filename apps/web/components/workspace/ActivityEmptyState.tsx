"use client";

import React, { useState, useEffect } from "react";

export function ActivityEmptyState() {
    const [activeTab, setActiveTab] = useState<"activity" | "milestones" | "notes">("activity");
    const [notes, setNotes] = useState<string>("");
    const [savedStatus, setSavedStatus] = useState<string>("Saved");

    // Load saved field notes from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem("kylro_studio_notes");
            if (saved !== null) {
                setNotes(saved);
            } else {
                setNotes("// Kylro Developer Scratchpad\n- Build core issue pipeline\n- Sync sprint kanban boards\n- Deploy production release");
            }
        } catch {
            // Ignore localStorage error if disabled
        }
    }, []);

    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setNotes(val);
        setSavedStatus("Saving…");
        try {
            localStorage.setItem("kylro_studio_notes", val);
            setTimeout(() => setSavedStatus("Saved"), 350);
        } catch {
            setSavedStatus("Local");
        }
    };

    return (
        <div className="studio-card p-5 flex flex-col justify-between relative overflow-hidden bg-zinc-900/70 border border-zinc-800/80">
            <div>
                {/* ── Header & Tab Switcher ── */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800/70">
                    <div className="flex items-center gap-1 bg-zinc-950/80 p-0.5 rounded-lg border border-zinc-800/70 text-[11px]">
                        <button
                            type="button"
                            onClick={() => setActiveTab("activity")}
                            className={`px-2.5 py-1 rounded-md transition-all font-medium ${activeTab === "activity"
                                    ? "bg-zinc-800 text-zinc-100 shadow-xs"
                                    : "text-zinc-400 hover:text-zinc-200"
                                }`}
                        >
                            Activity
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("milestones")}
                            className={`px-2.5 py-1 rounded-md transition-all font-medium ${activeTab === "milestones"
                                    ? "bg-zinc-800 text-zinc-100 shadow-xs"
                                    : "text-zinc-400 hover:text-zinc-200"
                                }`}
                        >
                            Roadmap
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("notes")}
                            className={`px-2.5 py-1 rounded-md transition-all font-medium ${activeTab === "notes"
                                    ? "bg-zinc-800 text-zinc-100 shadow-xs"
                                    : "text-zinc-400 hover:text-zinc-200"
                                }`}
                        >
                            Notes
                        </button>
                    </div>

                    {activeTab === "notes" && (
                        <span className="font-mono text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            {savedStatus}
                        </span>
                    )}
                </div>

                {/* ── Tab 1: Real-time Activity Timeline ── */}
                {activeTab === "activity" && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[12px] font-semibold text-zinc-300">
                                Live Studio Events
                            </span>
                            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Real-time
                            </span>
                        </div>

                        <div className="relative pl-5 space-y-4.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-zinc-800">
                            <div className="relative">
                                <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#09090b] ring-1 ring-emerald-500/40" />
                                <p className="text-[12px] font-medium text-zinc-200 leading-tight">
                                    Workspace online & operational
                                </p>
                                <span className="text-[10px] text-zinc-500 font-mono">
                                    Just now · Cloud engine
                                </span>
                            </div>

                            <div className="relative">
                                <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-[#09090b] ring-1 ring-indigo-500/40" />
                                <p className="text-[12px] font-medium text-zinc-300 leading-tight">
                                    Sprint board synchronized
                                </p>
                                <span className="text-[10px] text-zinc-500 font-mono">
                                    10m ago · Kanban
                                </span>
                            </div>

                            <div className="relative">
                                <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-cyan-500 border-2 border-[#09090b] ring-1 ring-cyan-500/40" />
                                <p className="text-[12px] font-medium text-zinc-300 leading-tight">
                                    API schema verified
                                </p>
                                <span className="text-[10px] text-zinc-500 font-mono">
                                    1h ago · REST + Drizzle
                                </span>
                            </div>

                            <div className="relative">
                                <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-zinc-600 border-2 border-[#09090b]" />
                                <p className="text-[12px] font-medium text-zinc-400 leading-tight">
                                    Developer session started
                                </p>
                                <span className="text-[10px] text-zinc-500 font-mono">
                                    Today · Auth verified
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Tab 2: Roadmap / Milestones ── */}
                {activeTab === "milestones" && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[12px] font-semibold text-zinc-300">
                                Active Sprint Target
                            </span>
                            <span className="text-[10px] text-indigo-400 font-mono">
                                Sprint 1
                            </span>
                        </div>

                        <div className="space-y-3">
                            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
                                <div className="flex items-center justify-between text-[12px]">
                                    <span className="font-medium text-zinc-200">MVP Release Cut</span>
                                    <span className="text-emerald-400 font-mono text-[11px]">80%</span>
                                </div>
                                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="w-4/5 h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full" />
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-zinc-500">
                                    <span>Target: End of sprint</span>
                                    <span>4 tasks pending</span>
                                </div>
                            </div>

                            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
                                <div className="flex items-center justify-between text-[12px]">
                                    <span className="font-medium text-zinc-200">Board Drag & Drop</span>
                                    <span className="text-cyan-400 font-mono text-[11px]">100%</span>
                                </div>
                                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="w-full h-full bg-cyan-400 rounded-full" />
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-zinc-500">
                                    <span>Completed</span>
                                    <span className="text-emerald-400">Shipped</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Tab 3: Quick Developer Scratchpad ── */}
                {activeTab === "notes" && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[12px] font-semibold text-zinc-300">
                                Developer Scratchpad
                            </span>
                            <span className="text-[10px] text-zinc-500 font-mono">
                                Auto-saved
                            </span>
                        </div>

                        <div className="relative rounded-xl border border-zinc-800 bg-zinc-950/90 overflow-hidden">
                            <textarea
                                value={notes}
                                onChange={handleNotesChange}
                                placeholder="Jot down commands, backlog ideas, or architecture notes…"
                                rows={7}
                                className="w-full p-3 font-mono text-[12px] leading-relaxed text-zinc-300 bg-transparent border-none outline-none resize-none placeholder-zinc-600"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* ── Bottom Engine Status ── */}
            <div className="mt-5 pt-3 border-t border-zinc-800/70 flex items-center justify-between text-[11px] text-zinc-400">
                <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    Kylro Studio Cloud
                </span>
                <span className="font-mono text-zinc-400">v1.2</span>
            </div>
        </div>
    );
}
