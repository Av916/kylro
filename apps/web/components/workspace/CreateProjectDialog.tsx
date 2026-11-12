"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, FolderPlus, LoaderCircle, X } from "lucide-react";
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

        <h2 id="create-project-title">Create a project</h2>
        <p id="create-project-description">Create a project in the selected workspace.</p>
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

          {error && <p id="project-create-error" role="alert" className={styles.error}>{error}</p>}
        </div>

        <footer className={styles.footer}>
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
