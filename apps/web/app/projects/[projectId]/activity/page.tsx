export default async function ProjectActivityPage({ params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = await params;

    const events = [
        {
            title: "Project Initialized",
            desc: "Project workspace created with default role hierarchy.",
            user: "Workspace Owner",
            time: "Recently",
            icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        },
        {
            title: "Workspace Context Linked",
            desc: "Inherited workspace permissions and API connection endpoints.",
            user: "System",
            time: "Recently",
            icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
        }
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-6 sketch-fade-in">
            <div>
                <h1 className="text-[22px] font-bold text-[var(--ink-dark)]">Project Activity</h1>
                <p className="text-[12px] text-[var(--ink-faint)] mt-0.5">Audit log of commits, issue updates, and team actions.</p>
            </div>

            {/* Timeline */}
            <div className="sketch-card p-6">
                <h2 className="text-[13px] font-bold text-[var(--ink-dark)] mb-6">Recent Milestones</h2>
                
                <div className="relative pl-6 border-l-[1.5px] border-[var(--pencil-light)] space-y-8 ml-2">
                    {events.map((ev, i) => (
                        <div key={i} className="relative">
                            {/* Dot */}
                            <div className="absolute -left-[30px] top-0.5 w-6 h-6 rounded-full bg-[var(--paper-warm)] border-[1.5px] border-[var(--pencil)] flex items-center justify-center text-[var(--ink)] shadow-[1px_1px_0px_rgba(60,58,54,0.04)]">
                                {ev.icon}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h3 className="text-[13px] font-semibold text-[var(--ink-dark)]">{ev.title}</h3>
                                    <span className="text-[10px] text-[var(--ink-ghost)]">• {ev.time}</span>
                                </div>
                                <p className="text-[12px] text-[var(--ink-faint)] mb-1">{ev.desc}</p>
                                <span className="text-[11px] text-[var(--ink-ghost)] font-medium">By {ev.user}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 rounded-xl border-[1.5px] border-[var(--pencil-light)] bg-[var(--paper-warm)] flex items-center justify-between text-[12px] text-[var(--ink-faint)]">
                <span>All project activity is recorded in real-time with immutable event logging.</span>
                <span className="font-hand text-[15px] text-[var(--ink)]">Auto-synced</span>
            </div>
        </div>
    );
}
