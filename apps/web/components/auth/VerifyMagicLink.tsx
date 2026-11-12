"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { verifyMagicLink } from "../../lib/api";

export function VerifyMagicLink({ token }: { token: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const validToken = token.length >= 32 && token.length <= 128;

    async function handleVerify() {
        setLoading(true);
        setError("");
        try {
            await verifyMagicLink(token);
            router.replace("/workspace");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to sign in. Please try again.");
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center p-6">
            <section className="k-card max-w-md w-full p-8 space-y-5">
                <h1 className="text-2xl font-bold">Sign in to Klyro</h1>
                {validToken ? (
                    <>
                        <p>Confirm your sign-in to continue to your workspace.</p>
                        {error && <p role="alert">{error}</p>}
                        <button className="k-btn k-btn-primary" onClick={handleVerify} disabled={loading}>
                            {loading ? "Signing in…" : "Continue to workspace"}
                        </button>
                    </>
                ) : (
                    <p role="alert">This sign-in link is invalid. Please request a new one.</p>
                )}
                <p><Link href="/login" className="underline">Request a new sign-in link</Link></p>
            </section>
        </main>
    );
}
