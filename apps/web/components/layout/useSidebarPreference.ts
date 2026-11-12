"use client";

import { useSyncExternalStore } from "react";

const key = "kylro-sidebar-collapsed";
const eventName = "kylro-sidebar-preference";
let fallbackCollapsed = false;
function subscribe(callback: () => void) {
    window.addEventListener("storage", callback);
    window.addEventListener(eventName, callback);
    return () => { window.removeEventListener("storage", callback); window.removeEventListener(eventName, callback); };
}
function snapshot() {
    try { const stored = localStorage.getItem(key); return stored === null ? fallbackCollapsed : stored === "true"; } catch { return fallbackCollapsed; }
}
function subscribeViewport(callback: () => void) {
    const query = window.matchMedia("(max-width: 800px)");
    query.addEventListener("change", callback);
    return () => query.removeEventListener("change", callback);
}
export function useSidebarPreference() {
    const collapsed = useSyncExternalStore(subscribe, snapshot, () => false);
    const mobile = useSyncExternalStore(subscribeViewport, () => window.matchMedia("(max-width: 800px)").matches, () => false);
    function setCollapsed(value: boolean) {
        fallbackCollapsed = value;
        try { localStorage.setItem(key, String(value)); } catch { /* Browsers may disable persistent storage. */ }
        window.dispatchEvent(new Event(eventName));
    }
    return { collapsed, setCollapsed, mobile };
}
