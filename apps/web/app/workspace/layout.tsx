"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchUser, fetchWorkspaces } from "../../lib/api";
import { Sidebar } from "../../components/layout/Sidebar";
import { Header } from "../../components/layout/Header";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const [user,      setUser]      = useState<any>(null);
  const [workspace, setWorkspace] = useState<any>(null);
  const [loading,   setLoading]   = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const [uRes, wsRes] = await Promise.all([
          fetchUser().catch(() => null),
          fetchWorkspaces().catch(() => ({ data: [] })),
        ]);
        if (!mounted) return;
        if (uRes?.data?.user) setUser(uRes.data.user);
        if (wsRes?.data?.length > 0) setWorkspace(wsRes.data[0]);
        else if (!uRes?.data?.user) { router.push("/login"); return; }
      } catch {
        if (mounted) router.push("/login");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    init();
    return () => { mounted = false; };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--c-page)" }}>
        <div className="flex flex-col items-center gap-4">
          <span className="font-sketch text-[32px]" style={{ color: "var(--c-ink)" }}>Kylro</span>
          <span className="text-[13px]" style={{ color: "var(--c-ink-3)" }}>Loading workspace…</span>
          <div className="w-28 h-[2px] rounded-full overflow-hidden" style={{ background: "var(--c-border)" }}>
            <div className="w-1/2 h-full animate-pulse" style={{ background: "var(--c-ink-4)" }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--c-page)" }}>
      {/* Sidebar — animates width on open/close */}
      <Sidebar
        workspace={workspace}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          user={user}
          workspace={workspace}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
        />
        <main className="flex-1 overflow-y-auto" style={{ background: "var(--c-page)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
