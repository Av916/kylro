# Project workspace

The project area uses the workspace's paper, graphite, and sage palette, with local sketch fonts and responsive navigation. Project data is shared between the overview, issue list, board, members, activity, and settings views.

## Working features

- Create, edit, assign, discuss, and delete issues.
- Search and filter issues by status or assignee; sort by creation or last update.
- Move cards with drag and drop or the accessible status selector. Failed requests preserve the previous status.
- Add existing workspace members, change roles, and remove project members. Removal clears their issue assignments in the same database transaction.
- Rename the project. The header, navigation, and overview use the saved name. Owners can also delete it after confirming its exact name.
- View actual issue counts, completion progress, member counts, creation dates, and latest updates. Activity is a current-record summary, not a historical audit log.

## Permissions

Every API operation requires authentication and current membership in the parent workspace. Workspace creators become owners. Workspace owners have top authority over all projects in their workspace; workspace admins can access and manage all its projects and appoint project admins. These permissions never extend to another workspace.

Project creators become project owners and can appoint project admins. Ordinary workspace members and viewers need explicit project membership to access a project. Each project has its own team and roles: viewers read issues and comments; members create and edit issues and post comments; project admins also delete issues and manage settings, members, and viewers. Only workspace owners, workspace admins, and project owners can appoint, demote, or remove project admins. Project owners cannot be removed or demoted through member management. Workspace owners and project owners can delete projects.

Workspace and project roles are independent. A workspace viewer with an explicit project member role can contribute to that project. Demoting a workspace admin removes inherited access immediately; any explicit project memberships still apply. Removing workspace membership revokes project access even if a stale project membership exists.

The member picker includes eligible people already in the workspace. It does not send email invitations.

## API

- `GET/POST /api/projects/:projectId/issues`
- `PATCH/DELETE /api/projects/:projectId/issues/:issueId`
- `GET/POST /api/projects/:projectId/issues/:issueId/comments`
- `GET /api/projects/:projectId/member-candidates`
- Existing project and member routes handle settings and membership mutations.

These endpoints use the existing issues and comments tables; no schema migration is needed.

## Validation

Run `bun run check-types` and `bun run lint` from the repository root. Run `bun test tests/auth-api.test.ts` for the existing authentication client tests.

The PostgreSQL integration suite is opt-in:

```sh
TEST_DATABASE_URL='<direct PostgreSQL connection URL>' bun test tests/project.integration.test.ts
```

The database account must be able to create schemas. Each run creates a uniquely named `kylro_test_…` schema, applies the existing migrations there, exercises the actual Express API with real sessions, and drops that schema on completion. It never uses application tables outside its schema. Use a direct connection because transaction poolers can reject the startup `search_path` option. Without `TEST_DATABASE_URL`, these tests are skipped.

For production build verification when Turbopack's worker ports are unavailable:

```sh
cd apps/web
bun run build -- --webpack
```

## Workspace area

`/workspace` now shares the selected workspace across overview, projects, issues, members, activity, and settings. The selection survives reloads. All counts, project cards, people, search results, and recent updates come from the database; zero and empty states remain empty instead of falling back to sample data.

- Create and switch workspaces; rename or change their slug. Owners can delete a workspace after typing its name to confirm.
- Search projects, issues, and teammates with the header or Ctrl/Cmd+K.
- Create projects and issues; filter workspace issues and update status. Open an issue in its project for details, assignment, and comments.
- Owners/admins can add existing Kylro users by email. This adds workspace membership; it does not send an invitation. Workspace admins inherit management access to all projects within that workspace; other members need explicit project membership.
- Only owners appoint/manage admins. Owners and your own membership are protected. Removing a member removes their project memberships and clears assignments transactionally; project owners must resolve their owned projects before removal.
- Workspace viewers cannot create projects. Project roles independently govern editing within each project.
- The closed-by-default activity drawer overlays the content. Its quick actions, the recent-updates bell, and sign-out all work. Updates summarize existing records, rather than representing a durable notification or audit history.

Additional endpoints: `GET /api/workspaces/:workspaceId/dashboard`, `POST /api/workspaces/:workspaceId/members`, and `PATCH/DELETE /api/workspaces/:workspaceId/members/:userId`. The dashboard returns all projects and their issues for workspace owners/admins, and only assigned projects and their issues for other members. No database migration is required.

The integration suite also checks workspace dashboard scoping, real totals, member validation, owner protection, viewer creation restrictions, and assignment cleanup/access revocation after removal.

## Navigation and motion

The shared desktop sidebar preference persists across workspace and project pages. The project navigation becomes a drawer below 801px; Escape, backdrop dismissal, focus restoration, and keyboard focus containment are supported.

GSAP drives short, staggered page/card entrances and sidebar width/slide transitions. Animations are scoped to their mounted components and reverted on navigation or unmount; reduced-motion preferences skip movement. The team view includes role filtering, real membership summaries, and stacked member rows on mobile.
