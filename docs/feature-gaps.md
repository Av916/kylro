# Feature review

Reviewed the current workspace/project routes, API modules, and database schemas.

| Feature | Current behavior | Remaining work |
| --- | --- | --- |
| Invitations | Workspace admins can add users who already have a Kylro account. | Email invitations, expiring invitation tokens, acceptance, and revocation. |
| Live updates and notifications | Changes made in the current screen update its shared state; headers provide manual refresh. The bell displays derived recent updates. | Cross-session synchronization and a persisted notification inbox with read/unread state. |
| Activity history | Activity is assembled from current creation/update timestamps. | Durable audit events with actor, action, and prior values; history of deleted records and intermediate changes. |
| Issue planning | Issues have title, description, status, assignee, and comments. | Priorities, labels, due dates, attachments, and sprint/milestone planning. |
| Ownership transfer | Owner roles are protected from removal/demotion. | A transfer flow so a project owner can hand over responsibility before leaving. |
| Unexpected application errors | API calls show contextual errors and retry controls. | Route error boundaries for uncaught rendering failures. |

## Implemented in this review

- Root `app/not-found.tsx` handles unmatched URLs with the shared paper/sage/sketch theme.
- Recovery links lead to the workspace, accessible projects, and home; the page requires no authenticated API request.
- Project API 404 responses use the same visual recovery screen without distinguishing nonexistent projects from inaccessible projects.
- API authentication and server failures retain their existing sign-in/retry treatment.

Unmatched URLs return HTTP 404. A project API 404 arrives after client rendering, so its recovery screen does not change the already-sent document HTTP status. Server-side project loading would be needed to return a document-level 404 for those data failures.
