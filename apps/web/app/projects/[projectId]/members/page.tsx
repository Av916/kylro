"use client";

import { useEffect, useState, use } from "react";
import { fetchProjectMembers } from "../../../../lib/api";

export default function ProjectMembersPage({ params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = use(params);
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadMembers = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await fetchProjectMembers(projectId);
            setMembers(data.data || []);
        } catch (err: any) {
            console.error(err);
            setError("Could not load project members.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadMembers(); }, [projectId]);

    return (
        <div className="max-w-5xl mx-auto space-y-6 sketch-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[22px] font-bold text-[var(--ink-dark)]">Project Members</h1>
                    <p className="text-[12px] text-[var(--ink-faint)] mt-0.5">Manage team access, permissions, and roles.</p>
                </div>
                <button 
                    onClick={() => alert("To add members, invite them to the workspace first.")}
                    className="sketch-btn sketch-btn-dark px-3.5 py-2 text-[12px]"
                >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add member
                </button>
            </div>

            {/* Members Table */}
            <div className="sketch-card overflow-hidden">
                <div className="px-5 py-3 border-b-[1.5px] border-[var(--pencil-light)] bg-[var(--paper-warm)] flex items-center justify-between text-[10px] font-semibold text-[var(--ink-faint)] uppercase tracking-widest">
                    <span>Collaborator</span>
                    <span>Role</span>
                </div>

                {loading ? (
                    <div className="p-8 space-y-3">
                        <div className="h-10 bg-[var(--paper-warm)] rounded-lg animate-pulse"></div>
                        <div className="h-10 bg-[var(--paper-warm)] rounded-lg animate-pulse"></div>
                    </div>
                ) : error ? (
                    <div className="p-12 text-center text-[12px] text-[var(--ink-faint)]">
                        <p className="mb-3">{error}</p>
                        <button onClick={loadMembers} className="sketch-btn sketch-btn-outline px-3 py-1.5 text-[12px]">Retry</button>
                    </div>
                ) : members.length === 0 ? (
                    <div className="p-12 text-center text-[12px] text-[var(--ink-faint)]">
                        No members found in this project.
                    </div>
                ) : (
                    <div className="divide-y divide-[var(--pencil-light)]">
                        {members.map((member) => {
                            const initial = member.name ? member.name.charAt(0).toUpperCase() : "U";
                            const role = member.role ? member.role.charAt(0).toUpperCase() + member.role.slice(1) : "Member";
                            return (
                                <div key={member.userId} className="px-5 py-3.5 flex items-center justify-between hover:bg-[var(--paper-warm)]/40 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[var(--ink-dark)] text-white font-bold text-[11px] flex items-center justify-center shadow-[1px_1px_0px_rgba(0,0,0,0.08)]">
                                            {initial}
                                        </div>
                                        <div>
                                            <span className="text-[13px] font-medium text-[var(--ink-dark)] block leading-snug">
                                                {member.name || "Workspace Member"}
                                            </span>
                                            <span className="text-[11px] text-[var(--ink-faint)] block">{member.email}</span>
                                        </div>
                                    </div>
                                    <span className={`sketch-badge ${member.role === "owner" ? "bg-[var(--paper-warm)] border-[var(--pencil)] text-[var(--ink)]" : ""}`}>
                                        {role}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Info Notice */}
            <div className="p-4 rounded-xl border-[1.5px] border-[var(--pencil-light)] bg-[var(--paper-warm)] flex items-start gap-3 text-[12px] text-[var(--ink-faint)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <p className="leading-relaxed">
                    Project members are inherited from the parent workspace. Roles control permissions for issues, boards, and settings.
                </p>
            </div>
        </div>
    );
}
