"use client";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CircleCheck, Folder, LayoutGrid, Menu, Plus, Search, Settings, Users, X, LogOut, LoaderCircle, ArrowUpRight, ChevronRight } from "lucide-react";
import { NotificationCenter } from "./NotificationCenter";
import { RefreshButton } from "../layout/RefreshButton";
import { PageMotion } from "../motion/PageMotion";
import { useSidebarMotion } from "../motion/useSidebarMotion";
import { useSidebarPreference } from "../layout/useSidebarPreference";
import { useWorkspace } from "./WorkspaceProvider";
import { WorkspaceForm, type WorkspaceAction } from "./WorkspaceDialogs";
import { CreateProjectDialog } from "./CreateProjectDialog";
import { Modal } from "../project/ProjectUI";
import { workspaceApi, issueHref } from "../../lib/workspace-api";
import { errorMessage } from "../../lib/project-api";
const Actions = createContext<(action: WorkspaceAction) => void>(() => {});
export const useWorkspaceAction = () => useContext(Actions);
const nav = [["", "Overview", LayoutGrid], ["/projects", "Projects", Folder], ["/members", "Members", Users], ["/issues", "Issues", CircleCheck], ["/settings", "Settings", Settings]] as const;
export function WorkspaceShell({ children }: { children: ReactNode }) {
    const root = useRef<HTMLDivElement>(null);
    const { user, workspaces, data, loading, error, refresh, select } = useWorkspace();
    const path = usePathname(), router = useRouter();
    const [sidebar, setSidebar] = useState(false);
    const { collapsed, setCollapsed, mobile } = useSidebarPreference();
    useSidebarMotion(root, ".ws-sidebar", mobile ? sidebar : !collapsed, mobile);
    const [action, setAction] = useState<WorkspaceAction>(null);
    const [search, setSearch] = useState(false), [query, setQuery] = useState("");
    const [logoutError, setLogoutError] = useState("");
    const [signingOut, setSigningOut] = useState(false);
    const logoutPending = useRef(false);
    useEffect(() => { const handler = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setSearch(value => !value); } if (e.key === "Escape") setSidebar(false); }; window.addEventListener("keydown", handler); return () => window.removeEventListener("keydown", handler); }, []);
    const results = data ? [
        ...data.projects.map(p => ({ id: p.id, title: p.name, type: "Project", href: `/projects/${p.id}` })),
        ...data.issues.map(i => ({ id: i.id, title: i.title, type: "Issue", href: issueHref(i) })),
        ...data.members.map(m => ({ id: m.userId, title: `${m.name} · ${m.email}`, type: "Member", href: `/workspace/members?q=${encodeURIComponent(m.email)}` })),
    ].filter(r => r.title.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 25) : [];
    async function logout() {
        if (logoutPending.current) return;
        logoutPending.current = true;
        setSigningOut(true); setLogoutError("");
        try { await workspaceApi.logout(); router.replace("/login"); router.refresh(); }
        catch (err) { setLogoutError(errorMessage(err)); setSigningOut(false); logoutPending.current = false; }
    }
    return <Actions.Provider value={setAction}><div ref={root} className={`ws-shell ${collapsed ? "ws-collapsed" : ""}`}>
        <a className="project-skip" href="#workspace-content">Skip to content</a>
        {sidebar && <button className="ws-sidebar-backdrop" aria-label="Close navigation" onClick={() => setSidebar(false)} />}
        <aside className={`ws-sidebar ${sidebar ? "open" : ""}`}><div className="ws-brand"><Link href="/workspace"><span className="project-brand-icon">k.</span><span>Kylro</span></Link><button className="ws-icon" aria-label="Close sidebar" onClick={() => { setSidebar(false); if (!mobile) setCollapsed(true); }}><X size={18} /></button></div>
            {data && <div className="project-switcher ws-current-workspace"><span className="project-monogram">{data.workspace.name.charAt(0).toUpperCase()}</span><div><strong>{data.workspace.name}</strong><span>Your workspace</span></div></div>}<span className="ws-eyebrow">Your workspace</span><nav aria-label="Workspace navigation">{nav.map(([suffix, label, Icon]) => <Link key={label} href={`/workspace${suffix}`} aria-current={path === `/workspace${suffix}` ? "page" : undefined} onClick={() => setSidebar(false)}><Icon size={18} strokeWidth={1.6} />{label}{data && (label === "Issues" || label === "Members") && <span className="project-nav-count">{label === "Issues" ? data.issues.filter(i => i.status !== "done").length : data.members.length}</span>}</Link>)}</nav>
            <div className="ws-workspaces-heading"><span className="ws-eyebrow">Your workspaces</span><button className="ws-icon" aria-label="Create workspace" onClick={() => setAction("workspace")}><Plus size={16} /></button></div>
            <div className="ws-workspaces">{workspaces.map(w => <button key={w.id} className={data?.workspace.id === w.id ? "selected" : ""} aria-pressed={data?.workspace.id === w.id} onClick={() => { if (data?.workspace.id !== w.id) select(w.id); setSidebar(false); router.push("/workspace"); }}><span>{w.name.charAt(0).toUpperCase()}</span><strong>{w.name}</strong></button>)}<button onClick={() => setAction("workspace")}><span><Plus size={15} /></span>New workspace</button></div>
        </aside>
        <div className="ws-main"><header className="ws-header"><button className="ws-icon" aria-label="Toggle navigation" aria-expanded={mobile ? sidebar : !collapsed} onClick={() => { if (mobile) { setSidebar(v => !v); } else setCollapsed(!collapsed); }}><Menu size={19} /></button><div className="ws-breadcrumb"><span>{data?.workspace.name || "Workspace"}</span><ChevronRight size={14} /><strong>{nav.find(([suffix]) => path === `/workspace${suffix}`)?.[1] || "Activity"}</strong></div><button className="ws-search-trigger" onClick={() => setSearch(true)}><Search size={18} /><span>Search projects, issues, members…</span><kbd>Ctrl K</kbd></button><RefreshButton refresh={refresh} /><NotificationCenter /><details className="ws-account"><summary><span className="ws-avatar">{user.name.charAt(0).toUpperCase()}</span><span>{user.name.split(" ")[0]}</span></summary><div><strong>{user.name}</strong><small>{user.email}</small><Link href="/workspace/settings">Workspace settings</Link><button type="button" className={`ws-signout${signingOut ? " is-pending" : ""}`} disabled={signingOut} aria-label={signingOut ? "Signing out…" : "Sign out"} aria-busy={signingOut} onClick={() => void logout()}>{signingOut ? <LoaderCircle size={16} className="ws-signout-spinner" /> : <LogOut size={16} />}<span role="status">{signingOut ? "Signing out…" : "Sign out"}</span></button>{logoutError && <p role="alert">{logoutError}</p>}</div></details></header>
            <main id="workspace-content" className="ws-content">{error && <div className="ws-error" role="alert">{error}<button className="ws-button secondary" onClick={() => void refresh()}>Retry</button></div>}{loading ? <div className="ws-empty" role="status">Gathering your workspace…</div> : !data && error ? <div className="ws-empty"><p>Could not load this workspace. Retry above or choose another workspace.</p></div> : !data ? <div className="ws-empty"><Folder size={40} /><h1>No workspaces yet</h1><p>Create your first workspace to bring projects and people together.</p><button className="ws-button" onClick={() => setAction("workspace")}>Create workspace</button></div> : <PageMotion key={data.workspace.id}>{children}</PageMotion>}</main>
        </div>
        {action === "project" && data && <CreateProjectDialog workspaceId={data.workspace.id} onClose={() => setAction(null)} onSuccess={() => void refresh()} />}
        {action && action !== "project" && <WorkspaceForm key={`${data?.workspace.id}-${action}`} action={action} onClose={() => setAction(null)} />}
        {search && <Modal title="Find your work" onClose={() => setSearch(false)}><div className="ws-form"><label>Search this workspace<input placeholder="Project, issue, or teammate…" value={query} onChange={e => setQuery(e.target.value)} /></label><div className="ws-results">{results.map(r => <Link key={`${r.type}-${r.id}`} href={r.href} onClick={() => setSearch(false)}><span><small>{r.type}</small><strong>{r.title}</strong></span><ArrowUpRight size={16} /></Link>)}{!results.length && <p className="ws-muted">No matches. Try a different search.</p>}</div></div></Modal>}

    </div></Actions.Provider>;
}
