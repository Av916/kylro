# Invitations, notifications, and live updates

Workspace members pages include email invitations, resend, revocation, delivery status, and expiry. Existing-account membership remains available separately. Invitations expire after seven days. Only the invited email can accept after signing in; a sign-in link can provision a new account and returns to the invitation page. Tokens are hashed in PostgreSQL, single use, and replaced on resend. Owners manage admin invitations. Sends are limited and report provider failures.

Configure `BREVO_API_KEY` and a verified `EMAIL_FROM` in the API environment. Restart the API after changing credentials. The current configured key returned HTTP 401 during provider verification, so actual email delivery requires replacement credentials. Tests intercept Brevo requests and send no real email.

Migration `20261112182444_great_black_panther` adds invitations, persistent notifications, per-user change cursors, and transactional database triggers. It has been applied to the configured database. The triggers notify members of project issue/comment/membership changes and workspace membership changes. Reads check current access, and read/unread status is saved in PostgreSQL.

Authenticated `/api/events` streams changes across API processes by checking a persisted user revision every two seconds. Workspace and project providers refresh after changes. The inbox reconnects automatically, exposes unread counts, supports read/unread and mark-all-read, and loads older notifications. Session expiry closes the stream. Reverse proxies must disable buffering for `/api/events` and allow long-lived connections.

Validation: 15 PostgreSQL integration tests plus a separate live-stream test passed in isolated schemas. Browser interaction checks cover invitation send/accept, notifications, and live UI refresh. Type checks, lint, and the Webpack production build passed.
