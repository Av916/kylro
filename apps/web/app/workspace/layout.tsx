"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchUser, fetchWorkspaces } from "../../lib/api";
import { Sidebar } from "../../components/layout/Sidebar";
import { Header } from "../../components/layout/Header";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [workspace, setWorkspace] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            try {
                const [userData, workspacesData] = await Promise.all([
                    fetchUser().catch(() => null),
                    fetchWorkspaces().catch(() => ({ data: [] })),
                ]);

                if (!isMounted) return;

                if (userData?.data?.user) {
                    setUser(userData.data.user);
                }

                if (workspacesData?.data && workspacesData.data.length > 0) {
                    setWorkspace(workspacesData.data[0]);
                } else if (!userData?.data?.user) {
                    router.push("/login");
                    return;
                }
            } catch (err) {
                console.error("Workspace layout load error:", err);
                if (isMounted) router.push("/login");
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadData();

        return () => {
            isMounted = false;
        };
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
                
                <div className="studio-card p-8 flex flex-col items-center gap-5 max-w-xs w-full shadow-2xl relative z-10 border border-white/10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
                        <span className="font-bold text-lg tracking-wider">K</span>
                    </div>
                    
                    <div className="space-y-1.5 text-center">
                        <p className="text-[15px] font-semibold text-zinc-100 tracking-tight">
                            Klyro Studio
                        </p>
                        <p className="text-[12px] text-zinc-400">
                            Connecting workspace…
                        </p>
                    </div>

                    <div className="w-36 h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="w-1/2 h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full animate-[shimmer_1.4s_infinite_linear] bg-[length:200%_100%]" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[#09090b] text-zinc-100 relative selection:bg-indigo-500/30 selection:text-indigo-200">
            {/* Ambient Lighting Accents */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-indigo-600/[0.07] blur-[140px] pointer-events-none rounded-full" />
            <div className="absolute top-1/3 right-10 w-[450px] h-[300px] bg-cyan-600/[0.04] blur-[130px] pointer-events-none rounded-full" />

            <Sidebar workspace={workspace} />
            
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
                <Header user={user} workspace={workspace} />
                <main className="flex-1 overflow-y-auto px-5 py-6 md:px-8 md:py-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
