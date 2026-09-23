"use client";

import React, { useEffect, useState, useCallback } from "react";
import { fetchWorkspaces, fetchProjects, fetchUser, createWorkspace } from "../../lib/api";
import { WorkspaceStats } from "../../components/workspace/WorkspaceStats";
import { ProjectGrid } from "../../components/workspace/ProjectGrid";
import { ActivityEmptyState } from "../../components/workspace/ActivityEmptyState";

function getGreeting(): string {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
}

function getFormattedDate(): string {
    return new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
    });
}


export default function WorkspacePage() {
    const [workspace, setWorkspace] = useState<any>(null);
    const [projects, setProjects] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Workspace creation state for new accounts
    const [newWsName, setNewWsName] = useState("");
    const [creatingWs, setCreatingWs] = useState(false);
    const [wsCreateError, setWsCreateError] = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const [wsRes, uRes] = await Promise.all([
                fetchWorkspaces().catch(() => ({ data: [] })),
                fetchUser().catch(() => null),
            ]);

            if (uRes?.data?.user) {
                setUser(uRes.data.user);
                if (!newWsName) {
                    const first = uRes.data.user.name?.split(" ")[0] || "My";
                    setNewWsName(`${first}'s Studio`);
                }
            }

            if (wsRes.data && wsRes.data.length > 0) {
                const ws = wsRes.data[0];
                setWorkspace(ws);
                const pRes = await fetchProjects(ws.id).catch(() => ({ data: [] }));
                setProjects(pRes.data || []);
            } else {
                setWorkspace(null);
            }
        } catch (err: any) {
            console.error("Workspace load error:", err);
            setError("Could not connect to Kylro API server. Please check that the server is running.");
        } finally {
            setLoading(false);
        }
    }, [newWsName]);

    useEffect(() => {
        load();
    }, [load]);

    const handleCreateWorkspace = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = newWsName.trim();
        if (!trimmed) return;

        setCreatingWs(true);
        setWsCreateError("");
        try {
            const res = await createWorkspace({ name: trimmed });
            if (res.data) {
                setWorkspace(res.data);
                // Also trigger window reload so layout captures the new workspace
                window.location.reload();
            }
        } catch (err: any) {
            setWsCreateError(err.message || "Failed to create workspace. Try a different name.");
            setCreatingWs(false);
        }
    };

    // ── Modern Studio Skeleton Loading State ──
    if (loading) {
        return (
            <div className="max-w-6xl mx-auto space-y-7 pt-2">
                <div className="space-y-3">
                    <div className="h-8 w-64 bg-zinc-800/60 rounded-xl animate-pulse" />
                    <div className="h-4 w-44 bg-zinc-800/40 rounded-lg animate-pulse" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-28 bg-zinc-900/60 border border-zinc-800/60 rounded-2xl animate-pulse" />
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-6">
                    <div className="h-80 bg-zinc-900/60 border border-zinc-800/60 rounded-2xl animate-pulse" />
                    <div className="h-80 bg-zinc-900/60 border border-zinc-800/60 rounded-2xl animate-pulse hidden lg:block" />
                </div>
            </div>
        );
    }

    // ── Actual Network/Server Connection Error ──
    if (error) {
        return (
            <div className="max-w-md mx-auto my-24 p-8 studio-card text-center bg-zinc-900 border border-zinc-800 shadow-2xl">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>
                <h3 className="text-[18px] font-bold text-zinc-100 mb-1.5">
                    Server Disconnected
                </h3>
                <p className="text-zinc-400 text-[13px] mb-6 leading-relaxed">
                    {error}
                </p>
                <button onClick={load} className="studio-btn-primary px-5 py-2.5 text-[13px] w-full">
                    Retry Connection
                </button>
            </div>
        );
    }

    // ── New User / No Workspace State: Beautiful Onboarding Setup ──
    if (!workspace) {
        const firstName = user?.name ? user.name.split(" ")[0] : null;

        return (
            <div className="max-w-xl mx-auto my-12 studio-fade-in space-y-6">
                <div className="text-center space-y-2">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/25 ring-1 ring-white/20 mb-4">
                        <span className="font-bold text-2xl">K</span>
                    </div>
                    <h1 className="text-[26px] sm:text-[30px] font-extrabold text-white tracking-tight">
                        Welcome to Kylro{firstName ? `, ${firstName}` : ""}!
                    </h1>
                    <p className="text-[14px] text-zinc-400 max-w-md mx-auto leading-relaxed">
                        Let&apos;s initialize your developer workspace to organize codebases, manage sprints, and collaborate with your team.
                    </p>
                </div>

                <div className="studio-card p-7 sm:p-8 bg-zinc-900/90 border border-zinc-800 shadow-2xl space-y-6">
                    <form onSubmit={handleCreateWorkspace} className="space-y-5">
                        <div>
                            <label className="block text-[13px] font-medium text-zinc-200 mb-2">
                                Workspace Name
                            </label>
                            <input
                                type="text"
                                value={newWsName}
                                onChange={(e) => setNewWsName(e.target.value)}
                                placeholder="e.g. Acme Engineering, Personal Studio"
                                className="studio-input w-full px-4 py-2.5 text-[14px] placeholder-zinc-500"
                                autoFocus
                                disabled={creatingWs}
                            />
                            <p className="text-[11px] text-zinc-500 mt-1.5 font-mono">
                                kylro.app/workspaces/{newWsName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "studio"}
                            </p>
                            {wsCreateError && (
                                <p className="text-[12px] text-rose-400 mt-2 font-medium">
                                    {wsCreateError}
                                </p>
                            )}
                        </div>

                        {/* Quick Presets */}
                        <div>
                            <label className="block text-[12px] font-medium text-zinc-400 mb-2">
                                Suggested workspace names
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    `${firstName ? `${firstName}'s Studio` : "Personal Studio"}`,
                                    "Core Engineering",
                                    "Product Labs",
                                    "DevOps & Platform",
                                ].map((preset) => (
                                    <button
                                        key={preset}
                                        type="button"
                                        onClick={() => setNewWsName(preset)}
                                        className="text-[12px] px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 border border-zinc-700/60 transition-colors"
                                    >
                                        {preset}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={creatingWs || !newWsName.trim()}
                            className="studio-btn-primary w-full py-3 text-[14px] font-semibold"
                        >
                            {creatingWs ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                    Creating Workspace…
                                </span>
                            ) : (
                                "Launch Workspace →"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const firstName = user?.name ? user.name.split(" ")[0] : null;

    // ── Full Rich Dashboard View ──
    return (
        <div className="max-w-[1160px] mx-auto pb-16 studio-fade-in pt-1 space-y-7">
            {/* ── Editorial Hero Greeting Header ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-zinc-800/60">
                <div>
                    {/* Date stamp & status */}
                    <div className="flex items-center gap-2 text-[12px] text-zinc-400 mb-2">
                        <span className="font-mono text-zinc-400">{getFormattedDate()}</span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Studio Mode Active
                        </span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-[28px] sm:text-[34px] font-extrabold text-white tracking-tight leading-tight">
                        {getGreeting()}{firstName ? `, ${firstName}` : ""}
                    </h1>

                    <p className="text-[13px] text-zinc-400 mt-1 max-w-xl">
                        Welcome to your workspace. Monitor your active projects, track sprint velocity, and coordinate with team members.
                    </p>
                </div>

                {/* Workspace Health Pill */}
                <div className="flex items-center gap-3 self-start md:self-auto bg-zinc-900/90 border border-zinc-800/90 px-4 py-2 rounded-xl text-[12px] text-zinc-300 shadow-md">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                    <span>Workspace: <strong className="text-white font-semibold">{workspace.name}</strong></span>
                </div>
            </div>

            {/* ── Studio Pulse Stats ── */}
            <div>
                <WorkspaceStats projectsCount={projects.length} membersCount={1} />
            </div>

            {/* ── Main Workspace Content: Projects + Studio Intelligence Panel ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-7 items-start">
                {/* Projects Section */}
                <div className="min-w-0">
                    <ProjectGrid
                        projects={projects}
                        workspaceId={workspace.id}
                        onRefresh={load}
                    />
                </div>

                {/* Right Studio Panel (Activity, Milestones, Scratchpad) */}
                <aside className="sticky top-16 hidden lg:block">
                    <ActivityEmptyState />
                </aside>
            </div>
        </div>
    );
}
