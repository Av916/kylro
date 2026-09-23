"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  fetchWorkspaces, fetchProjects, fetchUser, createWorkspace,
} from "../../lib/api";
import { WorkspaceStats } from "../../components/workspace/WorkspaceStats";
import { ProjectGrid }    from "../../components/workspace/ProjectGrid";
import { RecentActivity } from "../../components/workspace/RecentActivity";
import { QuickActions }   from "../../components/workspace/QuickActions";

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

function fmtDate() {
  return new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

export default function WorkspacePage() {
  const [workspace, setWorkspace]         = useState<any>(null);
  const [projects,  setProjects]          = useState<any[]>([]);
  const [user,      setUser]              = useState<any>(null);
  const [loading,   setLoading]           = useState(true);
  const [error,     setError]             = useState("");
  const [newWsName, setNewWsName]         = useState("");
  const [creatingWs, setCreatingWs]       = useState(false);
  const [wsErr,     setWsErr]             = useState("");

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
        if (!newWsName) setNewWsName(`${uRes.data.user.name?.split(" ")[0] ?? "My"}'s Studio`);
      }
      if (wsRes.data?.length > 0) {
        const ws = wsRes.data[0];
        setWorkspace(ws);
        const pRes = await fetchProjects(ws.id).catch(() => ({ data: [] }));
        setProjects(pRes.data ?? []);
      } else {
        setWorkspace(null);
      }
    } catch {
      setError("Could not connect to the Kylro API. Please check the server is running.");
    } finally {
      setLoading(false);
    }
  }, [newWsName]);

  useEffect(() => { load(); }, [load]);

  const handleCreateWs = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = newWsName.trim();
    if (!t) return;
    setCreatingWs(true);
    setWsErr("");
    try {
      const res = await createWorkspace({ name: t });
      if (res.data) { setWorkspace(res.data); window.location.reload(); }
    } catch (err: any) {
      setWsErr(err.message ?? "Failed to create workspace.");
      setCreatingWs(false);
    }
  };

  /* ── Skeleton ── */
  if (loading) {
    return (
      <div className="flex h-full">
        {/* main col */}
        <div className="flex-1 p-9">
          <div className="h-10 w-72 rounded-xl animate-pulse mb-2" style={{ background: "var(--c-hover)" }} />
          <div className="h-4 w-52 rounded animate-pulse mb-9" style={{ background: "var(--c-border)" }} />
          <div className="grid grid-cols-3 gap-5 mb-9">
            {[1,2,3].map(i => <div key={i} className="h-[150px] rounded-2xl animate-pulse" style={{ background: "var(--c-hover)" }} />)}
          </div>
          <div className="grid grid-cols-2 gap-5">
            {[1,2,3,4].map(i => <div key={i} className="h-[165px] rounded-2xl animate-pulse" style={{ background: "var(--c-hover)" }} />)}
          </div>
        </div>
        {/* right col */}
        <div className="hidden lg:block w-[340px] h-full animate-pulse" style={{ background: "var(--c-sidebar)", borderLeft: "1px solid var(--c-border)" }} />
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-9">
        <div className="k-card text-center p-10 max-w-sm w-full">
          <h3 className="text-[17px] font-semibold mb-2" style={{ color: "var(--c-ink)" }}>Server Disconnected</h3>
          <p className="text-[13px] mb-6" style={{ color: "var(--c-ink-3)" }}>{error}</p>
          <button onClick={load} className="k-btn k-btn-primary w-full">Retry Connection</button>
        </div>
      </div>
    );
  }

  /* ── No workspace: onboarding ── */
  if (!workspace) {
    const fn = user?.name?.split(" ")[0] ?? null;
    return (
      <div className="flex items-center justify-center min-h-full p-9">
        <div className="w-full max-w-md k-fade-in">
          <div className="text-center mb-8">
            <span className="font-sketch text-[40px]" style={{ color: "var(--c-ink)" }}>Kylro</span>
            <h1 className="text-[22px] font-semibold mt-2" style={{ color: "var(--c-ink)" }}>
              Welcome{fn ? `, ${fn}` : ""}!
            </h1>
            <p className="text-[14px] mt-1.5" style={{ color: "var(--c-ink-3)" }}>
              Set up your workspace to organize projects and collaborate.
            </p>
          </div>
          <div className="k-card p-7">
            <form onSubmit={handleCreateWs} className="space-y-5">
              <div>
                <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--c-ink-2)" }}>
                  Workspace Name
                </label>
                <input type="text" value={newWsName} onChange={e => setNewWsName(e.target.value)}
                  placeholder="e.g. Acme Engineering, Personal Studio"
                  className="k-input w-full px-4 py-2.5 text-[14px]" autoFocus disabled={creatingWs} />
                {wsErr && <p className="text-[12px] mt-1.5" style={{ color: "#7A4F1E" }}>{wsErr}</p>}
              </div>
              <div className="flex flex-wrap gap-2">
                {[fn ? `${fn}'s Studio` : "Personal Studio", "Core Engineering", "Product Labs"].map(p => (
                  <button key={p} type="button" onClick={() => setNewWsName(p)}
                    className="text-[12px] px-3 py-1.5 rounded-lg transition-colors"
                    style={{ border: "1px solid var(--c-border)", background: "var(--c-hover)", color: "var(--c-ink-2)" }}>
                    {p}
                  </button>
                ))}
              </div>
              <button type="submit" disabled={creatingWs || !newWsName.trim()}
                className="k-btn k-btn-primary w-full text-[14px]" style={{ height: 44 }}>
                {creatingWs ? "Creating…" : "Launch Workspace →"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const firstName = user?.name?.split(" ")[0] ?? "there";

  /* ══════════════════════════════════════════
     MAIN DASHBOARD — three-column shell:
     [Sidebar 260px] [Main flex-1] [Right 340px]
     The layout shell owns col-1. This page owns col-2 & col-3.
     ══════════════════════════════════════════ */
  return (
    <div className="flex h-full k-fade-in" style={{ minHeight: "100%" }}>

      {/* ── Column 2: Main content ── */}
      <div className="flex-1 min-w-0 overflow-y-auto paper-grain" style={{ padding: 36 }}>

        {/* Welcome section */}
        <div className="relative mb-8">
          {/* Date */}
          <p className="text-[12px] font-mono mb-2" style={{ color: "var(--c-ink-4)" }}>
            {fmtDate()}
          </p>

          {/* Greeting */}
          <h1
            className="font-sketch leading-tight pencil-underline"
            style={{ fontSize: 42, fontWeight: 500, color: "var(--c-ink)", marginBottom: 8 }}
          >
            {greeting()}, {firstName}.
          </h1>
          <p className="text-[16px]" style={{ color: "var(--c-ink-3)" }}>
            Here&apos;s what&apos;s happening in your workspace.
          </p>

          {/* Annotation — top-right handwritten note */}
          <div
            className="absolute right-0 top-0 hidden sm:block font-sketch text-right"
            style={{ fontSize: 17, color: "var(--c-ink)", opacity: 0.38, transform: "rotate(-1.5deg)", lineHeight: 1.4 }}
            aria-hidden
          >
            Ideas + People<br />
            <span style={{ paddingLeft: "12px" }}>→ Progress</span>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ marginBottom: 36 }}>
          <WorkspaceStats projectsCount={projects.length} membersCount={1} />
        </div>

        {/* Pencil dashed divider */}
        <hr className="pencil-divider" style={{ marginBottom: 32 }} />

        {/* Projects grid */}
        <div style={{ marginBottom: 36 }}>
          <ProjectGrid projects={projects} workspaceId={workspace.id} onRefresh={load} />
        </div>
      </div>

      {/* ── Column 3: Right panel (340px fixed) ── */}
      <aside
        className="hidden lg:flex flex-col flex-shrink-0 overflow-y-auto paper-grain"
        style={{
          width: 340,
          background: "var(--c-sidebar)",
          borderLeft: "1px solid var(--c-border)",
          padding: 24,
          gap: 20,
        }}
      >
        {/* Recent Activity card */}
        <div className="k-card-lift paper-grain" style={{ padding: 24 }}>
          <RecentActivity />
        </div>

        {/* Quick Actions card */}
        <div className="k-card-lift paper-grain" style={{ padding: 24 }}>
          <QuickActions />
        </div>

        {/* Bottom quote */}
        <div className="mt-auto pt-4">
          <p
            className="font-sketch text-center leading-snug"
            style={{ fontSize: 15, color: "var(--c-ink-5)" }}
          >
            &ldquo;A better way<br />to build, together.&rdquo;
          </p>
        </div>
      </aside>
    </div>
  );
}
