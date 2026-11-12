"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Circle, CircleCheck, CircleDot, X } from "lucide-react";
import { statusLabels, type IssueStatus } from "../../lib/project-api";

export function StatusBadge({ status }: { status: IssueStatus }) {
    const Icon = status === "done" ? CircleCheck : status === "in_progress" ? CircleDot : Circle;
    return <span className={`project-status ${status}`}><Icon size={13} />{statusLabels[status]}</span>;
}
export function Avatar({ name, small = false }: { name: string; small?: boolean }) {
    return <span className={`project-avatar${small ? " small" : ""}`} title={name}>{name.trim().split(/\s+/).slice(0, 2).map(word => word[0]).join("").toUpperCase()}</span>;
}
export function EmptySketch() {
    return <svg className="project-empty-sketch" viewBox="0 0 160 110" fill="none" aria-hidden="true">
        <path d="M37 22l74-6 6 78-74 5z" fill="var(--c-card)" stroke="currentColor" strokeWidth="1.4" />
        <path d="M48 16l72 5-6 79-72-5z" fill="var(--c-card)" stroke="currentColor" strokeWidth="1.5" />
        <path d="M57 39l7 7 13-14M82 40l24 2M55 60l8 1M76 61l28 2M54 78l8 1M74 79l26 2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
        <path d="M117 65l18-34 5 3-18 35-7 7zM135 31l3-6 5 3-3 6" fill="var(--c-accent-soft)" stroke="currentColor" strokeWidth="1.3" />
        <path d="M23 42l-7-3M27 29l-3-7M27 58l-8 3M137 85l8 3M134 96l5 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>;
}
export function EmptyState({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
    return <div className="project-empty"><EmptySketch /><h3>{title}</h3><p>{children}</p>{action}</div>;
}
export function PageHeading({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: ReactNode }) {
    return <div className="project-page-heading"><div><span className="project-eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{actions && <div className="project-actions">{actions}</div>}</div>;
}
export function Modal({ title, children, onClose, busy = false, wide = false }: { title: string; children: ReactNode; onClose: () => void; busy?: boolean; wide?: boolean }) {
    const dialog = useRef<HTMLDialogElement>(null);
    useEffect(() => {
        const element = dialog.current;
        element?.showModal();
        element?.querySelector<HTMLElement>("input:not([disabled]), textarea:not([disabled]), select:not([disabled])")?.focus();
        return () => element?.close();
    }, []);
    return <dialog ref={dialog} className={`project-dialog${wide ? " wide" : ""}`} aria-labelledby="project-dialog-title" onCancel={event => { event.preventDefault(); if (!busy) onClose(); }} onClick={event => { if (event.target === event.currentTarget && !busy) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose(); } }}>
        <div className="project-dialog-header"><h2 id="project-dialog-title">{title}</h2><button className="project-icon-button" onClick={onClose} aria-label="Close dialog" disabled={busy}><X size={19} /></button></div>
        {children}
    </dialog>;
}
