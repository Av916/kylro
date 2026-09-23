"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { fetchProject } from "../../../lib/api";
import { ProjectSidebar } from "../../../components/layout/ProjectSidebar";
import { ProjectHeader } from "../../../components/layout/ProjectHeader";

export default function ProjectLayout({ 
    children, 
    params 
}: { 
    children: React.ReactNode; 
    params: Promise<{ projectId: string }> 
}) {
    const { projectId } = use(params);
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function loadData() {
            try {
                const projectData = await fetchProject(projectId);
                setProject(projectData.data.project);
            } catch (err) {
                console.error(err);
                router.push("/workspace");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [projectId, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--paper)] flex flex-col items-center justify-center gap-3">
                <div className="sketch-spinner"></div>
                <span className="font-hand text-[18px] text-[var(--ink-faint)]">Opening project…</span>
            </div>
        );
    }

    if (!project) return null;

    return (
        <div className="flex h-screen overflow-hidden bg-[var(--paper)] text-[var(--ink)]">
            <ProjectSidebar project={project} projectId={projectId} />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <ProjectHeader project={project} />
                <main className="flex-1 overflow-y-auto p-5 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
