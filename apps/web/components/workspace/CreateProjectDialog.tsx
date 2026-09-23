"use client";

import React, { useState } from "react";
import { createProject } from "../../lib/api";

const TEMPLATES = [
  { name: "Web Application",    desc: "Next.js / React with UI components" },
  { name: "API & Backend",      desc: "Express / Node / Database service" },
  { name: "Full-Stack Monorepo", desc: "Client, API, and shared packages" },
];

export function CreateProjectDialog({
  workspaceId, onClose, onSuccess,
}: { workspaceId: string; onClose: () => void; onSuccess: () => void }) {
  const [name, setName]           = useState("");
  const [tmpl, setTmpl]           = useState(0);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = name.trim();
    if (!t) return;
    setLoading(true);
    setError("");
    try {
      await createProject(workspaceId, { name: t });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create project.");
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 k-fade-in"
      style={{ background: "rgba(37,37,34,0.35)", backdropFilter: "blur(3px)" }}
    >
      <div
        className="w-full max-w-md relative"
        style={{
          background: "var(--c-card)",
          border: "1px solid var(--c-border)",
          borderRadius: 16,
          boxShadow: "0 12px 40px rgba(37,37,34,0.16)",
          padding: 28,
        }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-5 right-5 flex items-center justify-center rounded-lg transition-colors"
          style={{ width: 28, height: 28, color: "var(--c-ink-3)" }} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <h2 className="text-[18px] font-semibold mb-1" style={{ color: "var(--c-ink)" }}>Create new project</h2>
        <p className="text-[13px] mb-6" style={{ color: "var(--c-ink-3)" }}>
          Initialize a project for tracking, boards, and sprints.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--c-ink-2)" }} htmlFor="pname">
              Project name
            </label>
            <input id="pname" type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. Core Engine, Web Client…"
              className="k-input w-full px-3.5 py-2.5 text-[14px]" autoFocus disabled={loading} />
            {error && <p className="text-[12px] mt-1.5 font-medium" style={{ color: "#7A4F1E" }}>{error}</p>}
          </div>

          <div>
            <label className="block text-[12px] font-medium mb-2" style={{ color: "var(--c-ink-2)" }}>Template</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {TEMPLATES.map((t, i) => (
                <button key={t.name} type="button" onClick={() => setTmpl(i)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-[10px] text-left transition-all"
                  style={{
                    border: `1px solid ${tmpl === i ? "var(--c-accent)" : "var(--c-border)"}`,
                    background: tmpl === i ? "var(--c-accent-soft)" : "var(--c-card)",
                    color: tmpl === i ? "var(--c-ink)" : "var(--c-ink-2)",
                    fontSize: 13,
                    fontFamily: "inherit",
                  }}>
                  <div>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--c-ink-4)" }}>{t.desc}</p>
                  </div>
                  <div className="w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ml-3"
                    style={{ borderColor: tmpl === i ? "var(--c-accent)" : "var(--c-border)" }}>
                    {tmpl === i && <span className="w-2 h-2 rounded-full" style={{ background: "var(--c-accent)" }} />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4" style={{ borderTop: "1px solid var(--c-border)" }}>
            <button type="button" onClick={onClose}
              className="k-btn k-btn-ghost px-4 text-[13px]" disabled={loading}>Cancel</button>
            <button type="submit"
              className="k-btn k-btn-primary px-5 text-[13px]" disabled={loading || !name.trim()}>
              {loading ? "Creating…" : "Create project →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
