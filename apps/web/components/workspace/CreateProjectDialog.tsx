"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Columns3, FolderPlus, ListTodo, LoaderCircle, Users, X } from "lucide-react";
import { createProject } from "../../lib/api";
import styles from "./CreateProjectDialog.module.css";

export function CreateProjectDialog({
  workspaceId, onClose, onSuccess,
}: { workspaceId: string; onClose: () => void; onSuccess: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const validName = name.trim().length >= 2 && name.trim().length <= 100;

  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    element?.showModal();
    nameInput.current?.focus();
    return () => {
      element?.close();
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (loading || !validName) return;
    setLoading(true);
    setError("");
    try {
      await createProject(workspaceId, { name: name.trim() });
      onSuccess();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not create your project. Please try again.");
      setLoading(false);
    }
  }

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-labelledby="create-project-title"
      aria-describedby="create-project-description"
      onCancel={event => { event.preventDefault(); if (!loading) onClose(); }}
      onClick={event => {
        if (loading || event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
      }}
    >
      <header className={styles.header}>
        <div className={styles.icon}><FolderPlus size={23} strokeWidth={1.5} /></div>
        <button type="button" className={styles.close} onClick={onClose} disabled={loading} aria-label="Close create project dialog"><X size={19} strokeWidth={1.7} /></button>
        <span className={styles.eyebrow}>A SPACE FOR YOUR NEXT IDEA</span>
        <h2 id="create-project-title">Create a project</h2>
        <p id="create-project-description">Bring your tasks, ideas, and team together.<br />Great things start with a little space to build.</p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className={styles.body}>
          <div className={styles.field}>
            <label htmlFor="new-project-name">Project name</label>
            <input
              ref={nameInput}
              id="new-project-name"
              type="text"
              value={name}
              onChange={event => { setName(event.target.value); setError(""); }}
              placeholder="e.g. Website redesign"
              required
              minLength={2}
              maxLength={100}
              autoComplete="off"
              disabled={loading}
              aria-describedby={error ? "project-name-hint project-create-error" : "project-name-hint"}
            />
            <div className={styles.hintRow}><p id="project-name-hint">Something clear and memorable. You can rename it later.</p><span>{name.length}/100</span></div>
          </div>

          <div className={styles.includes}>
            <span className={styles.includesHeading}>A home for your best work</span>
            <p>Every project comes with the essentials.</p>
            <div className={styles.features}>
              <span><ListTodo size={16} strokeWidth={1.6} /> Issue tracking</span>
              <span><Columns3 size={16} strokeWidth={1.6} /> Project board</span>
              <span><Users size={16} strokeWidth={1.6} /> Your team</span>
            </div>
          </div>
          {error && <p id="project-create-error" role="alert" className={styles.error}>{error}</p>}
        </div>

        <footer className={styles.footer}>
          <span className={styles.footerNote}>Make room for good work.</span>
          <div className={styles.actions}>
            <button type="button" className={styles.cancel} onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className={styles.submit} disabled={loading || !validName}>
              {loading ? <><LoaderCircle size={16} className={styles.spinner} /> Creating…</> : <>Create project <ArrowRight size={16} /></>}
            </button>
          </div>
        </footer>
      </form>
    </dialog>
  );
}
