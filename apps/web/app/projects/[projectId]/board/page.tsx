export default async function ProjectBoardPage({ params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = await params;

    const columns = [
        {
            id: "todo", title: "To Do", count: 1,
            cards: [{ key: "ISSUE-1", title: "Setup initial workspace architecture & team members", priority: "High", pColor: "text-[var(--rust)] bg-[var(--rust-light)] border-[var(--rust)]/30" }]
        },
        { id: "in_progress", title: "In Progress", count: 0, cards: [] },
        {
            id: "done", title: "Done", count: 1,
            cards: [{ key: "ISSUE-0", title: "Configure project repository & database schema", priority: "Low", pColor: "text-[var(--sage)] bg-[var(--sage-light)] border-[var(--sage)]/30" }]
        }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-6 sketch-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[22px] font-bold text-[var(--ink-dark)]">Kanban Board</h1>
                    <p className="text-[12px] text-[var(--ink-faint)] mt-0.5">Visual status workflows and task execution.</p>
                </div>
                <span className="sketch-badge">Drag & Drop Preview</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {columns.map((col) => (
                    <div key={col.id} className="sketch-card p-4 flex flex-col min-h-[400px]">
                        {/* Column Header */}
                        <div className="flex items-center justify-between pb-3 mb-3 border-b-[1.5px] border-[var(--pencil-light)]">
                            <div className="flex items-center gap-2">
                                <span className="text-[13px] font-bold text-[var(--ink-dark)]">{col.title}</span>
                                <span className="w-5 h-5 rounded-full bg-[var(--paper-warm)] border-[1.5px] border-[var(--pencil-light)] flex items-center justify-center text-[10px] font-bold text-[var(--ink-faint)]">
                                    {col.count}
                                </span>
                            </div>
                            <span className="text-[var(--ink-ghost)] text-[14px]">⋯</span>
                        </div>

                        {/* Cards */}
                        <div className="space-y-3 flex-1 flex flex-col">
                            {col.cards.map((card) => (
                                <div 
                                    key={card.key} 
                                    className="p-3.5 rounded-xl border-[1.5px] border-[var(--pencil)] bg-[var(--paper)] shadow-[1px_2px_0px_rgba(60,58,54,0.04)] hover:border-[var(--pencil-dark)] transition-colors cursor-grab"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-mono text-[10px] text-[var(--ink-faint)]">{card.key}</span>
                                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${card.pColor}`}>
                                            {card.priority}
                                        </span>
                                    </div>
                                    <h4 className="text-[12px] font-semibold text-[var(--ink-dark)] leading-snug">{card.title}</h4>
                                    <div className="mt-3 pt-2.5 border-t border-[var(--pencil-light)] flex items-center justify-between text-[10px] text-[var(--ink-faint)]">
                                        <div className="w-5 h-5 rounded-full bg-[var(--ink-dark)] text-white text-[9px] font-bold flex items-center justify-center">A</div>
                                        <span className="font-hand text-[13px]">Draft</span>
                                    </div>
                                </div>
                            ))}

                            {col.cards.length === 0 && (
                                <div className="flex-1 border-[1.5px] border-dashed border-[var(--pencil)] rounded-xl p-6 flex flex-col items-center justify-center text-center">
                                    <span className="text-[12px] text-[var(--ink-faint)]">No issues in {col.title.toLowerCase()}</span>
                                    <span className="font-hand text-[14px] text-[var(--ink-ghost)] mt-1">Drop tasks here</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
