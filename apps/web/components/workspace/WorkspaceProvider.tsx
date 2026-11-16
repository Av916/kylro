"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { API_URL } from "../../lib/api";
import { useRouter } from "next/navigation";
import { workspaceApi, type Workspace, type WorkspaceData } from "../../lib/workspace-api";
import { errorMessage, ProjectApiError } from "../../lib/project-api";

type User = { id: string; name: string; email: string };
interface Context { user: User; workspaces: Workspace[]; data: WorkspaceData | null; loading: boolean; error: string; select: (id: string) => void; refresh: () => Promise<void>; reload: (id?: string) => Promise<void> }
const WorkspaceContext = createContext<Context | null>(null);
export const useWorkspace = () => { const context = useContext(WorkspaceContext); if (!context) throw new Error("Workspace provider missing"); return context; };
export function WorkspaceProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [id, setId] = useState("");
    const selected = useRef("");
    const [data, setData] = useState<WorkspaceData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const generation = useRef(0);
    const select = useCallback((value: string) => { if (value === selected.current) return; generation.current++; selected.current = value; setData(null); setLoading(!!value); setError(""); setId(value); try { localStorage.setItem("kylro-workspace", value); } catch { /* Storage can be unavailable in private browsing. */ } }, []);
    const reload = useCallback(async (preferred?: string) => {
        try {
            const [profile, list] = await Promise.all([workspaceApi.user(), workspaceApi.list()]);
            setUser(profile.user); setWorkspaces(list);
            let saved = ""; try { saved = new URLSearchParams(window.location.search).get("workspace") || localStorage.getItem("kylro-workspace") || ""; } catch { /* Storage can be unavailable in private browsing. */ }
            const choice = list.find(w => w.id === (preferred || selected.current || saved))?.id || list[0]?.id || "";
            if (choice !== selected.current) select(choice);
            else if (!choice) { setLoading(false); setError(""); }
        } catch (err) { if (err instanceof ProjectApiError && err.status === 401) router.replace("/login"); else { setError(errorMessage(err)); setLoading(false); } }
    }, [router, select]);
    const refresh = useCallback(async () => {
        if (!id) return;
        const ticket = ++generation.current;
        try { const next = await workspaceApi.dashboard(id); if (ticket === generation.current) { setData(next); setError(""); setWorkspaces(list => list.map(w => w.id === id ? next.workspace : w)); } }
        catch (err) { if (ticket === generation.current) { if (err instanceof ProjectApiError && err.status === 401) router.replace("/login"); setError(errorMessage(err)); } }
        finally { if (ticket === generation.current) setLoading(false); }
    }, [id, router]);
    // These effects load external API state; all updates follow the network response.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { void reload(); }, [reload]);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { void refresh(); }, [refresh]);
    useEffect(() => {
        const choose = (event: Event) => { const id = (event as CustomEvent<string>).detail; if (workspaces.some(ws => ws.id === id)) select(id); };
        window.addEventListener("kylro-select-workspace", choose);
        return () => window.removeEventListener("kylro-select-workspace", choose);
    }, [workspaces, select]);
    const userId = user?.id;
    useEffect(() => {
        if (!userId) return;
        const events = new EventSource(`${API_URL}/events`, { withCredentials: true });
        events.addEventListener("change", () => { void reload(); void refresh(); });
        events.addEventListener("session-ended", () => { events.close(); router.replace("/login"); });
        return () => events.close();
    }, [userId, reload, refresh, router]);
    if (!user) return <div className="ws-gate"><h1>Kylro</h1><p role={error ? "alert" : "status"}>{error || "Opening your workspace…"}</p>{error && <button onClick={() => void reload()}>Try again</button>}</div>;
    return <WorkspaceContext.Provider value={{ user, workspaces, data, loading, error, select, refresh, reload }}>{children}</WorkspaceContext.Provider>;
}
