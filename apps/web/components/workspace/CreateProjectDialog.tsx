"use client";

import React, { useState } from "react";
import { createProject } from "../../lib/api";

const ACCENT_COLORS = [
    { name: "Indigo", bg: "rgba(99, 102, 241, 0.15)", border: "rgba(99, 102, 241, 0.4)", text: "#818cf8" },
    { name: "Cyan", bg: "rgba(6, 182, 212, 0.15)", border: "rgba(6, 182, 212, 0.4)", text: "#22d3ee" },
    { name: "Violet", bg: "rgba(139, 92, 246, 0.15)", border: "rgba(139, 92, 246, 0.4)", text: "#a78bfa" },
    { name: "Emerald", bg: "rgba(16, 185, 129, 0.15)", border: "rgba(16, 185, 129, 0.4)", text: "#34d399" },
    { name: "Amber", bg: "rgba(245, 158, 11, 0.15)", border: "rgba(245, 158, 11, 0.4)", text: "#fbbf24" },
    { name: "Rose", bg: "rgba(244, 63, 94, 0.15)", border: "rgba(244, 63, 94, 0.4)", text: "#fb7185" },
];

const TEMPLATES = [
    { name: "Web Application", desc: "Next.js / React app with UI components" },
    { name: "API & Backend", desc: "Express / Node / Database service" },
    { name: "Full-Stack Monorepo", desc: "Integrated client, API, and shared packages" },
];

export function CreateProjectDialog({
    workspaceId,
    onClose,
    onSuccess,
}: {
    workspaceId: string;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [name, setName] = useState("");
    const [selectedColor, setSelectedColor] = useState(0);
    const [selectedTemplate, setSelectedTemplate] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) return;

        setLoading(true);
        setError("");

        try {
            await createProject(workspaceId, { name: trimmed });
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to create project. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 studio-fade-in">
            <div
                className="studio-card w-full max-w-md p-6 bg-zinc-900/95 border border-zinc-800 shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
                    aria-label="Close dialog"
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {/* Header */}
                <div className="mb-5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    </div>
                    <h2 className="text-[19px] font-bold text-zinc-100 leading-tight">
                        Create new project
                    </h2>
                    <p className="text-[12px] text-zinc-400 mt-1">
                        Initialize a project for sprint tracking, Kanban boards, and issues.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Project Name */}
                    <div>
                        <label
                            htmlFor="project-name"
                            className="block text-[12px] font-medium text-zinc-200 mb-1.5"
                        >
                            Project name
                        </label>
                        <input
                            type="text"
                            id="project-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="studio-input w-full px-3.5 py-2 text-[13px] placeholder-zinc-500"
                            placeholder="e.g. Core Engine, Web Client, Mobile App"
                            autoFocus
                            disabled={loading}
                        />
                        {error && (
                            <p className="text-[12px] text-rose-400 mt-1.5 font-medium">
                                {error}
                            </p>
                        )}
                    </div>

                    {/* Template Picker */}
                    <div>
                        <label className="block text-[12px] font-medium text-zinc-200 mb-1.5">
                            Workspace Template
                        </label>
                        <div className="space-y-1.5">
                            {TEMPLATES.map((tmpl, idx) => (
                                <button
                                    key={tmpl.name}
                                    type="button"
                                    onClick={() => setSelectedTemplate(idx)}
                                    className={`w-full text-left p-2.5 rounded-lg border text-[12px] transition-all flex items-center justify-between ${selectedTemplate === idx
                                            ? "bg-indigo-500/10 border-indigo-500/40 text-zinc-100"
                                            : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                                        }`}
                                >
                                    <div>
                                        <p className="font-medium">{tmpl.name}</p>
                                        <p className="text-[10px] text-zinc-500 mt-0.5">{tmpl.desc}</p>
                                    </div>
                                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${selectedTemplate === idx
                                            ? "border-indigo-400 bg-indigo-500"
                                            : "border-zinc-700"
                                        }`}>
                                        {selectedTemplate === idx && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Accent Picker */}
                    <div>
                        <label className="block text-[12px] font-medium text-zinc-200 mb-1.5">
                            Accent Color
                        </label>
                        <div className="grid grid-cols-6 gap-2">
                            {ACCENT_COLORS.map((col, idx) => (
                                <button
                                    key={col.name}
                                    type="button"
                                    onClick={() => setSelectedColor(idx)}
                                    className={`py-1.5 rounded-lg border text-[11px] font-medium flex items-center justify-center transition-all ${selectedColor === idx
                                            ? "ring-2 ring-indigo-400/80 scale-105"
                                            : "opacity-75 hover:opacity-100"
                                        }`}
                                    style={{ backgroundColor: col.bg, borderColor: col.border, color: col.text }}
                                >
                                    <span
                                        className="w-2.5 h-2.5 rounded-full"
                                        style={{ backgroundColor: col.text }}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-800/80">
                        <button
                            type="button"
                            onClick={onClose}
                            className="studio-btn-secondary px-4 py-2 text-[12px]"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="studio-btn-primary px-5 py-2 text-[12px]"
                            disabled={loading || !name.trim()}
                        >
                            {loading ? (
                                <span className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                    Creating…
                                </span>
                            ) : (
                                "Create project →"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
