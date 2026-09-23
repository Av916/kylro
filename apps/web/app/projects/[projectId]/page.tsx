import Link from "next/link";

export default async function ProjectOverviewPage({ params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = await params;

    const quickLinks = [
        {
            title: "Issue Tracking",
            desc: "Log bugs, tasks, and feature requests.",
            href: `/projects/${projectId}/issues`,
            badge: "Next module",
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="m9 12 2 2 4-4" /></svg>
        },
        {
            title: "Kanban Board",
            desc: "Visual Kanban board with drag & drop.",
            href: `/projects/${projectId}/board`,
            badge: "Preview",
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="4" height="18" rx="1" /><rect x="10" y="3" width="4" height="12" rx="1" /><rect x="16" y="3" width="4" height="15" rx="1" /></svg>
        },
        {
            title: "Team & Roles",
            desc: "Manage collaborator access and roles.",
            href: `/projects/${projectId}/members`,
            badge: "Active",
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
        },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8 sketch-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-[22px] font-bold text-[var(--ink-dark)]">Project Overview</h1>
                <p className="text-[12px] text-[var(--ink-faint)] mt-0.5">
                    Status, workflow tools, and team access for this project.
                </p>
            </div>
            
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Open Issues", value: "0", sub: "Awaiting module rollout" },
                    { label: "Members", value: "1", sub: "Workspace collaborators" },
                    { label: "Status", value: "Good", sub: "All endpoints operational", color: "text-[var(--sage)]" },
                ].map((m) => (
                    <div key={m.label} className="sketch-card px-5 py-4">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--ink-faint)] block">{m.label}</span>
                        <span className={`text-[24px] font-bold leading-tight block mt-1 ${m.color || "text-[var(--ink-dark)]"}`}>{m.value}</span>
                        <span className="text-[11px] text-[var(--ink-faint)]">{m.sub}</span>
                    </div>
                ))}
            </div>

            {/* Quick Jump */}
            <div>
                <h2 className="text-[15px] font-bold text-[var(--ink-dark)] mb-1">Project Workspaces</h2>
                <p className="text-[12px] text-[var(--ink-faint)] mb-4">Jump directly into project management views.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {quickLinks.map((item) => (
                        <Link key={item.title} href={item.href} className="group block">
                            <div className="sketch-card-lift p-5 h-full flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="w-9 h-9 rounded-xl bg-[var(--paper-warm)] border-[1.5px] border-[var(--pencil-light)] flex items-center justify-center text-[var(--ink)]">
                                            {item.icon}
                                        </div>
                                        <span className="sketch-badge">{item.badge}</span>
                                    </div>
                                    <h3 className="text-[14px] font-semibold text-[var(--ink-dark)] mb-1 group-hover:text-[var(--ink)] transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-[11px] text-[var(--ink-faint)] leading-relaxed">{item.desc}</p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-[var(--pencil-light)] flex items-center justify-between text-[11px] text-[var(--ink-faint)]">
                                    <span>Open view</span>
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Metadata */}
            <div className="sketch-card p-5">
                <h3 className="text-[13px] font-bold text-[var(--ink-dark)] mb-3">Project Metadata</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[12px]">
                    <div>
                        <span className="text-[var(--ink-faint)] block mb-0.5 text-[10px] uppercase tracking-wider font-semibold">Project ID</span>
                        <span className="font-mono text-[var(--ink)]">{projectId.slice(0, 8)}…</span>
                    </div>
                    <div>
                        <span className="text-[var(--ink-faint)] block mb-0.5 text-[10px] uppercase tracking-wider font-semibold">Stack</span>
                        <span className="text-[var(--ink)] font-medium">REST + Drizzle</span>
                    </div>
                    <div>
                        <span className="text-[var(--ink-faint)] block mb-0.5 text-[10px] uppercase tracking-wider font-semibold">Design</span>
                        <span className="font-hand text-[15px] text-[var(--ink)]">Pencil Sketch</span>
                    </div>
                    <div>
                        <span className="text-[var(--ink-faint)] block mb-0.5 text-[10px] uppercase tracking-wider font-semibold">Status</span>
                        <span className="text-[var(--sage)] font-semibold">● Online</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
