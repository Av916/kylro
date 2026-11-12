"use client";

import { useRef, useState } from "react";
import { PanelRightOpen, X } from "lucide-react";
import Link from "next/link";
import { WorkspaceActivity } from "./WorkspaceViews";
import { useWorkspace } from "./WorkspaceProvider";
import { useWorkspaceAction } from "./WorkspaceShell";
import styles from "./WorkspaceDrawer.module.css";

export function WorkspaceDrawer() {
  const { data } = useWorkspace();
  const action = useWorkspaceAction();
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  function openDrawer() {
    dialog.current?.showModal();
    setOpen(true);
  }

  return (
    <>
      <button
        type="button"
        className={`k-btn k-btn-ghost ${styles.trigger}`}
        onClick={openDrawer}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="workspace-activity-drawer"
      >
        <PanelRightOpen size={16} strokeWidth={1.7} />
        Activity &amp; tools
      </button>

      <dialog
        ref={dialog}
        id="workspace-activity-drawer"
        aria-labelledby="workspace-drawer-title"
        className={styles.drawer}
        onClose={() => setOpen(false)}
        onClick={event => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
            event.currentTarget.close();
          }
        }}
      >
        <div className={styles.header}>
          <div>
            <h2 id="workspace-drawer-title">Activity &amp; tools</h2>
            <p>A little context, whenever you need it.</p>
          </div>
          <button
            type="button"
            className={styles.close}
            onClick={() => dialog.current?.close()}
            aria-label="Close activity drawer"
          >
            <X size={19} strokeWidth={1.7} />
          </button>
        </div>

        <div className={styles.content}>
          <section className={`k-card-lift paper-grain ${styles.card}`}>
            <div className="ws-section-heading"><h3>Recent activity</h3><Link href="/workspace/activity" onClick={() => dialog.current?.close()}>View all →</Link></div><WorkspaceActivity compact onNavigate={() => dialog.current?.close()} />
          </section>
          <section className={`k-card-lift paper-grain ${styles.card}`}>
            <h3>Quick actions</h3><div className="ws-quick-actions">
              {data?.workspace.role !== "viewer" && <button onClick={() => { dialog.current?.close(); action("project"); }}>New project →</button>}
              {data && ["owner", "admin"].includes(data.workspace.role) && <button onClick={() => { dialog.current?.close(); action("member"); }}>Add member →</button>}
              {data?.projects.some(p => p.role !== "viewer") && <button onClick={() => { dialog.current?.close(); action("issue"); }}>Create issue →</button>}
              <Link href="/workspace/settings" onClick={() => dialog.current?.close()}>Workspace settings →</Link>
            </div>
          </section>
          <p className={`font-sketch ${styles.quote}`}>
            &ldquo;A better way<br />to build, together.&rdquo;
          </p>
        </div>
      </dialog>
    </>
  );
}
