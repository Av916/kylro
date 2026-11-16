"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import { API_URL } from "../../lib/api";
import { errorMessage } from "../../lib/project-api";
import { notificationApi, type Notification } from "../../lib/workspace-api";
import { Modal } from "../project/ProjectUI";

export function NotificationCenter() {
    const [open, setOpen] = useState(false), [items, setItems] = useState<Notification[]>([]);
    const [unread, setUnread] = useState(0), [nextOffset, setNextOffset] = useState<number | null>(null);
    const [error, setError] = useState(""), [busy, setBusy] = useState(false), [connected, setConnected] = useState(false);
    const load = useCallback(async (offset = 0) => {
        try { const page = await notificationApi.list(offset); setItems(old => offset ? [...old, ...page.items.filter(item => !old.some(existing => existing.id === item.id))] : page.items); setUnread(page.unreadCount); setNextOffset(page.nextOffset); setError(""); }
        catch (err) { setError(errorMessage(err)); }
    }, []);
    useEffect(() => {
        // Initial synchronization with the notification API.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void load();
        const events = new EventSource(`${API_URL}/events`, { withCredentials: true });
        events.addEventListener("change", () => { setConnected(true); void load(); });
        events.addEventListener("session-ended", () => { events.close(); setConnected(false); });
        events.addEventListener("error", () => setConnected(false));
        return () => events.close();
    }, [load]);
    async function mark(item: Notification, read: boolean) { setBusy(true); try { await notificationApi.read(item.id, read); await load(); } catch (err) { setError(errorMessage(err)); } finally { setBusy(false); } }
    async function markAll() { setBusy(true); try { await notificationApi.readAll(); await load(); } catch (err) { setError(errorMessage(err)); } finally { setBusy(false); } }
    return <>
        <button className="ws-icon ws-notification-button" aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`} title={connected ? "Notifications · Live" : "Notifications · Reconnecting"} onClick={() => { setOpen(true); void load(); }}><Bell size={19} />{unread > 0 && <span className="ws-notification-count">{unread > 99 ? "99+" : unread}</span>}</button>
        {open && <Modal title="Notifications" onClose={() => setOpen(false)}><div className="ws-form"><div className="ws-notification-toolbar"><span className="ws-muted">{unread} unread {connected ? "· Live" : "· Reconnecting"}</span>{unread > 0 && <button className="ws-text-button" disabled={busy} onClick={() => void markAll()}><CheckCheck size={14} /> Mark all read</button>}</div>{error && <p className="ws-error" role="alert">{error}<button onClick={() => void load()}>Retry</button></p>}<div className="ws-results ws-notifications">{items.map(item => <div className={item.readAt ? "" : "unread"} key={item.id}><Link href={item.href} onClick={() => { if (!item.readAt) void mark(item, true); window.dispatchEvent(new CustomEvent("kylro-select-workspace", { detail: item.workspaceId })); setOpen(false); }}><strong>{item.title}</strong><small>{new Date(item.createdAt).toLocaleString()}</small></Link><button className="ws-text-button" disabled={busy} aria-label={`${item.readAt ? "Mark unread" : "Mark read"}: ${item.title}`} onClick={() => void mark(item, !item.readAt)}>{item.readAt ? "Mark unread" : "Mark read"}</button></div>)}{!items.length && <p className="ws-muted">You’re all caught up.</p>}</div>{nextOffset !== null && <button className="ws-button secondary" onClick={() => void load(nextOffset)}>Load more</button>}</div></Modal>}
    </>;
}
