import React from "react";

interface AuthShellProps {
    children: React.ReactNode;
    sidePanel?: React.ReactNode;
    footerAnnotation?: string;
}

export function AuthShell({
    children,
    sidePanel,
    footerAnnotation = "Better tools for bigger dreams.",
}: AuthShellProps) {
    return (
        <main className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 text-[#1f1f1e] selection:bg-[#eae5d8] selection:text-[#1f1f1e]">
            {/* Top brand header */}
            <div className="w-full max-w-4xl mb-4 flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <span className="font-serif-title text-2xl font-bold tracking-tight text-[#1f1f1e]">
                        Klyro
                    </span>
                    <span className="text-xs px-2 py-0.5 border border-[#4a4843] rounded-sm text-[#5a574f] font-mono tracking-wider">
                        v0.1
                    </span>
                </div>
                <span className="text-xs text-[#737067] font-mono hidden sm:inline-block">
                    [developer workspace]
                </span>
            </div>

            {/* Main Double-Panel Frame */}
            <div className="w-full max-w-4xl bg-[#fdfcf9] border-[1.5px] border-[#2e2d2a] shadow-[4px_4px_0px_#2e2d2a] rounded-sm grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
                {/* Active Form Column (Left on Desktop, Full-width on Mobile) */}
                <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between relative">
                    {children}
                </div>

                {/* Companion Side Panel (Right on Desktop, Hidden on Mobile) */}
                {sidePanel && (
                    <div className="hidden lg:flex lg:col-span-5 border-l-[1.5px] border-[#2e2d2a] bg-[#f7f5f0] p-8 sm:p-10 flex-col justify-between relative overflow-hidden">
                        {sidePanel}
                    </div>
                )}
            </div>

            {/* Subtle Footer Annotation in Handwriting Font */}
            {footerAnnotation && (
                <footer className="mt-6 text-center">
                    <p className="font-handwriting text-lg text-[#5a574f] tracking-wide">
                        ~ {footerAnnotation} ~
                    </p>
                </footer>
            )}
        </main>
    );
}
