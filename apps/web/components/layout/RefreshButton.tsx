"use client";
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { errorMessage } from "../../lib/project-api";

export function RefreshButton({ refresh }: { refresh: () => Promise<void> }) {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    async function run() {
        if (busy) return;
        setBusy(true); setError("");
        try { await refresh(); } catch (err) { setError(errorMessage(err)); } finally { setBusy(false); }
    }
    return <div className="data-refresh"><button className="project-icon-button" aria-label={busy ? "Refreshing data" : "Refresh data"} title="Refresh data" disabled={busy} onClick={() => void run()}><RefreshCw size={16} className={busy ? "data-refresh-spinning" : undefined} /></button>{error && <p className="data-refresh-error" role="alert">{error}</p>}</div>;
}
