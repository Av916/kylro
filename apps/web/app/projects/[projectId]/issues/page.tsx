export default async function ProjectIssuesPage({ params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = await params;

    return (
        <div className="max-w-5xl mx-auto space-y-6 sketch-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[22px] font-bold text-[var(--ink-dark)]">Issues</h1>
                    <p className="text-[12px] text-[var(--ink-faint)] mt-0.5">Track bug reports, tasks, and feature roadmap items.</p>
                </div>
                <button 
                    disabled
                    className="sketch-btn sketch-btn-outline px-3.5 py-2 text-[12px] opacity-50 cursor-not-allowed"
                >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    New issue
                </button>
            </div>

            {/* Filter Bar */}
            <div className="sketch-card p-2.5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-1">
                    <button className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-[var(--ink-dark)] text-white shadow-[1px_1px_0px_rgba(0,0,0,0.1)]">
                        All Issues
                    </button>
                    <button className="px-3 py-1.5 rounded-lg text-[12px] text-[var(--ink-muted)] hover:bg-[var(--paper-hover)] transition-colors">
                        Assigned to me
                    </button>
                    <button className="px-3 py-1.5 rounded-lg text-[12px] text-[var(--ink-muted)] hover:bg-[var(--paper-hover)] transition-colors">
                        Closed
                    </button>
                </div>
                <input 
                    type="text" 
                    placeholder="Search or filter…"
                    disabled
                    className="sketch-input w-full sm:w-56 px-3 py-1.5 text-[12px]"
                />
            </div>
            
            {/* Empty State */}
            <div className="sketch-card p-14 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-[var(--paper-warm)] border-[1.5px] border-[var(--pencil)] flex items-center justify-center mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ink-faint)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>
                <span className="sketch-badge mb-3">Up Next</span>
                <h2 className="text-[18px] font-bold text-[var(--ink-dark)] mb-2">Issue Management Coming Up</h2>
                <p className="text-[12px] text-[var(--ink-faint)] max-w-md mx-auto leading-relaxed mb-6">
                    Full issue CRUD with priorities, markdown descriptions, assignees, and status workflows will be implemented in the next module.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg text-left text-[12px]">
                    {[
                        { title: "Priority Matrix", desc: "Triage from urgent bugs to ideas." },
                        { title: "Custom Labels", desc: "Color-coded tags and milestones." },
                        { title: "Activity Log", desc: "Audit trail of changes & comments." },
                    ].map((f) => (
                        <div key={f.title} className="p-3 rounded-xl border-[1.5px] border-[var(--pencil-light)] bg-[var(--paper-warm)]">
                            <span className="font-semibold text-[var(--ink)] block mb-0.5">{f.title}</span>
                            <span className="text-[var(--ink-faint)] text-[11px]">{f.desc}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
