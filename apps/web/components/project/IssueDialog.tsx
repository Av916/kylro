"use client";

import { useEffect, useState, type FormEvent } from "react";
import { MessageSquare, Send, Trash2 } from "lucide-react";
import { dateLabel, errorMessage, issueKey, projectApi, statuses, statusLabels, type Issue, type IssueComment, type IssueStatus } from "../../lib/project-api";
import { useProject } from "./ProjectProvider";
import { Avatar, Modal } from "./ProjectUI";

export function IssueDialog({ issue, initialStatus, onClose }: { issue?: Issue; initialStatus: IssueStatus; onClose: () => void }) {
    const { project, members, canEdit, canManage, saveIssue, removeIssue } = useProject();
    const [title, setTitle] = useState(issue?.title || "");
    const [description, setDescription] = useState(issue?.description || "");
    const [status, setStatus] = useState<IssueStatus>(issue?.status || initialStatus);
    const [assignedTo, setAssignedTo] = useState(issue?.assignedTo || "");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [comments, setComments] = useState<IssueComment[]>([]);
    const [comment, setComment] = useState("");
    const [commentsError, setCommentsError] = useState("");
    const [commentsLoading, setCommentsLoading] = useState(Boolean(issue));
    const [commentsAttempt, setCommentsAttempt] = useState(0);
    const [commentBusy, setCommentBusy] = useState(false);
    useEffect(() => {
        if (!issue) return;
        let active = true;
        projectApi.comments(project.id, issue.id).then(items => { if (active) { setComments(items); setCommentsError(""); } })
            .catch(error => { if (active) setCommentsError(errorMessage(error)); })
            .finally(() => { if (active) setCommentsLoading(false); });
        return () => { active = false; };
    }, [project.id, issue, commentsAttempt]);

    async function submit(event: FormEvent) {
        event.preventDefault();
        if (busy) return;
        setBusy(true); setError("");
        try {
            const input = { title: title.trim(), description: description.trim() || null, status, assignedTo: assignedTo || null };
            const saved = issue ? await projectApi.updateIssue(project.id, issue.id, input) : await projectApi.createIssue(project.id, input);
            saveIssue(saved); onClose();
        } catch (error) { setError(errorMessage(error)); } finally { setBusy(false); }
    }
    async function deleteIssue() {
        if (!issue || busy) return;
        setBusy(true); setError("");
        try { await projectApi.deleteIssue(project.id, issue.id); removeIssue(issue.id); onClose(); }
        catch (error) { setError(errorMessage(error)); } finally { setBusy(false); }
    }
    async function postComment(event: FormEvent) {
        event.preventDefault();
        if (!issue || !comment.trim() || commentBusy) return;
        setCommentBusy(true); setCommentsError("");
        try {
            await projectApi.addComment(project.id, issue.id, comment.trim());
            setComment("");
            setCommentsAttempt(value => value + 1);
        } catch (error) { setCommentsError(errorMessage(error)); } finally { setCommentBusy(false); }
    }
    return <Modal title={issue ? issueKey(issue) : "A new idea starts here"} onClose={onClose} busy={busy || commentBusy} wide>
        <form onSubmit={submit} className="project-issue-form">
            <label className="project-field"><span>Issue title</span><input autoFocus required maxLength={200} placeholder="What needs to get done?" value={title} onChange={event => setTitle(event.target.value)} disabled={!canEdit || busy} /></label>
            <label className="project-field"><span>Description <small>optional</small></span><textarea aria-label="Description" rows={4} maxLength={10000} placeholder="Add a little context, a few details, or a definition of done…" value={description} onChange={event => setDescription(event.target.value)} disabled={!canEdit || busy} /></label>
            <div className="project-form-grid"><label className="project-field"><span>Status</span><select aria-label="Status" value={status} onChange={event => setStatus(event.target.value as IssueStatus)} disabled={!canEdit || busy}>{statuses.map(status => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></label><label className="project-field"><span>Assignee</span><select aria-label="Assignee" value={assignedTo} onChange={event => setAssignedTo(event.target.value)} disabled={!canEdit || busy}><option value="">Unassigned</option>{members.map(member => <option key={member.userId} value={member.userId}>{member.name}</option>)}</select></label></div>
            {error && <p className="project-error" role="alert">{error}</p>}
            {confirmDelete && <div className="project-confirm"><p>Delete this issue and its comments? This cannot be undone.</p><div className="project-actions"><button type="button" className="project-button danger" disabled={busy} onClick={deleteIssue}>Delete permanently</button><button type="button" className="project-button secondary" disabled={busy} onClick={() => setConfirmDelete(false)}>Keep issue</button></div></div>}
            <div className="project-dialog-footer">{issue && canManage && <button type="button" className="project-text-button danger-text" disabled={busy} onClick={() => setConfirmDelete(true)}><Trash2 size={14} /> Delete issue</button>}<div className="project-actions"><button type="button" className="project-button secondary" onClick={onClose} disabled={busy || commentBusy}>{canEdit ? "Cancel" : "Close"}</button>{canEdit && <button type="submit" className="project-button" disabled={busy || commentBusy || !title.trim()}>{busy ? "Saving…" : issue ? "Save changes" : "Create issue"}</button>}</div></div>
        </form>
        {issue && <section className="project-comments"><h3><MessageSquare size={16} /> Discussion <span>{comments.length}</span></h3>{commentsLoading ? <p className="project-muted" role="status">Loading discussion…</p> : comments.length ? <div className="project-comment-list">{comments.map(item => <article key={item.id}><Avatar name={item.name} small /><div><strong>{item.name}</strong><time>{dateLabel(item.createdAt)}</time><p>{item.content}</p></div></article>)}</div> : <p className="project-muted">A little conversation goes a long way. Add the first comment.</p>}
            {commentsError && <div className="project-error" role="alert">{commentsError} <button className="project-text-button" onClick={() => setCommentsAttempt(value => value + 1)}>Reload discussion</button></div>}
            {canEdit && <form onSubmit={postComment} className="project-comment-compose"><label className="sr-only" htmlFor="issue-comment">Add a comment</label><textarea id="issue-comment" placeholder="Leave a note for your team…" rows={2} maxLength={5000} value={comment} onChange={event => setComment(event.target.value)} disabled={commentBusy} /><button className="project-icon-button" type="submit" disabled={commentBusy || !comment.trim()} aria-label="Post comment"><Send size={17} /></button></form>}
        </section>}
    </Modal>;
}
