import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import type { Server } from "node:http";

// Opt-in: each run creates an isolated schema and removes only that schema afterward.
// The normal database tables are never used by these tests.
const testDatabaseUrl = process.env.TEST_DATABASE_URL;
const requireDatabase = createRequire(new URL("../packages/database/package.json", import.meta.url));
const { Pool } = requireDatabase("pg") as { Pool: new (config: { connectionString?: string; connectionTimeoutMillis: number }) => typeof import("../packages/database/src/index").db.$client };

describe.skipIf(!testDatabaseUrl)("Project API with PostgreSQL", () => {
    const schema = `kylro_test_${crypto.randomUUID().replaceAll("-", "")}`;
    const bootstrap = new Pool({ connectionString: testDatabaseUrl, connectionTimeoutMillis: 10000 });
    let database: typeof import("../packages/database/src/index");
    let server: Server | undefined;
    let base = "";
    let createdSchema = false;
    const ids = { owner: crypto.randomUUID(), member: crypto.randomUUID(), viewer: crypto.randomUUID(), candidate: crypto.randomUUID(), outsider: crypto.randomUUID(), workspace: crypto.randomUUID(), project: crypto.randomUUID(), otherProject: crypto.randomUUID() };
    const cookies: Record<string, string> = {};
    let issueId = "";
    const originalFetch = globalThis.fetch;
    let invitationToken = "";
    let failEmail = false;


    async function api(path: string, user = "owner", method = "GET", body?: unknown) {
        return fetch(`${base}/api/projects/${ids.project}${path}`, {
            method,
            headers: { "Content-Type": "application/json", ...(cookies[user] ? { Cookie: cookies[user] } : {}) },
            body: body === undefined ? undefined : JSON.stringify(body),
        });
    }
    beforeAll(async () => {
        await bootstrap.query(`CREATE SCHEMA "${schema}"`);
        createdSchema = true;
        const url = new URL(testDatabaseUrl!);
        url.searchParams.set("options", `-c search_path=${schema}`);
        process.env.DATABASE_URL = url.toString();
        process.env.BREVO_API_KEY = "test-provider-key";
        globalThis.fetch = (async (input: Parameters<typeof fetch>[0], init?: Parameters<typeof fetch>[1]) => {
            if (String(input) === "https://api.brevo.com/v3/smtp/email") {
                const body = JSON.parse(String(init?.body));
                const match = body.htmlContent?.match(/invitations\?token=([a-f0-9]{64})/);
                if (match) invitationToken = match[1];
                return new Response("{}", { status: failEmail ? 500 : 201 });
            }
            return originalFetch(input, init);
        }) as typeof fetch;
        process.env.CLIENT_URL ||= "http://localhost:3000";
        database = await import("../packages/database/src/index");
        const { db } = database;
        const result = await db.$client.query("SELECT current_schema() AS schema");
        expect(result.rows[0].schema).toBe(schema);
        for (const migration of ["20260919182909_pretty_reavers", "20260919183358_early_iron_lad", "20261112182444_great_black_panther"]) {
            await db.$client.query(await readFile(new URL(`../packages/database/drizzle/${migration}/migration.sql`, import.meta.url), "utf8"));
        }
        const { schemas } = database;
        await db.insert(schemas.users).values(["owner", "member", "viewer", "candidate", "outsider"].map(role => ({ id: ids[role as keyof typeof ids], name: `Test ${role}`, email: `${role}@example.test`, username: role })));
        await db.insert(schemas.workspaces).values({ id: ids.workspace, name: "Isolated test workspace", slug: schema });
        await db.insert(schemas.workspaceMembers).values(["owner", "member", "viewer", "candidate"].map(role => ({ workspaceId: ids.workspace, userId: ids[role as keyof typeof ids], role: role === "owner" ? "owner" as const : "member" as const })));
        await db.insert(schemas.projects).values([{ id: ids.project, workspaceId: ids.workspace, name: "Test project" }, { id: ids.otherProject, workspaceId: ids.workspace, name: "Other test project" }]);
        await db.insert(schemas.projectMembers).values([
            { projectId: ids.project, userId: ids.owner, role: "owner" }, { projectId: ids.project, userId: ids.member, role: "member" }, { projectId: ids.project, userId: ids.viewer, role: "viewer" }, { projectId: ids.otherProject, userId: ids.owner, role: "owner" },
        ]);
        const { authService, SESSION_COOKIE_NAME } = await import("../apps/api/src/modules/auth/auth.service");
        for (const role of ["owner", "member", "viewer", "candidate", "outsider"]) {
            const session = await authService.createSession(ids[role as keyof typeof ids]);
            cookies[role] = `${SESSION_COOKIE_NAME}=${session.rawToken}`;
        }
        const { default: createApp } = await import("../apps/api/src/app");
        server = createApp().listen(0, "127.0.0.1");
        await new Promise<void>(resolve => server!.on("listening", resolve));
        const address = server.address();
        if (!address || typeof address === "string") throw new Error("No test server address");
        base = `http://127.0.0.1:${address.port}`;
    }, 30000);

    afterAll(async () => {
        globalThis.fetch = originalFetch;
        if (server) { server.closeAllConnections(); await new Promise<void>(resolve => server!.close(() => resolve())); }
        if (database) await database.db.$client.end();
        if (createdSchema) await bootstrap.query(`DROP SCHEMA "${schema}" CASCADE`);
        await bootstrap.end();
    }, 30000);

    test("requires authentication and rejects users outside the project", async () => {
        expect((await api("/issues", "anonymous")).status).toBe(401);
        expect((await api("/issues", "outsider")).status).toBe(404);
        expect((await api("/member-candidates", "viewer")).status).toBe(403);
    }, 30000);
    test("validates title, status and assignee membership", async () => {
        expect((await api("/issues", "owner", "POST", { title: "  " })).status).toBe(400);
        expect((await api("/issues", "owner", "POST", { title: "Test", status: "invalid" })).status).toBe(400);
        expect((await api("/issues", "owner", "POST", { title: "Test", assignedTo: ids.candidate })).status).toBe(400);
    }, 30000);
    test("a member can create a persisted issue; a viewer cannot", async () => {
        expect((await api("/issues", "viewer", "POST", { title: "Read only" })).status).toBe(403);
        const response = await api("/issues", "member", "POST", { title: "  Build the issue flow  ", description: "A real database record", assignedTo: ids.member });
        expect(response.status).toBe(201);
        const { data } = await response.json(); issueId = data.id;
        expect(data.title).toBe("Build the issue flow");
        expect(data.status).toBe("todo");
        expect((await (await api("/issues")).json()).data).toHaveLength(1);
    }, 30000);
    test("status changes persist and are scoped to the project", async () => {
        expect((await api(`/issues/${issueId}`, "viewer", "PATCH", { status: "done" })).status).toBe(403);
        const crossProject = await fetch(`${base}/api/projects/${ids.otherProject}/issues/${issueId}`, { method: "PATCH", headers: { Cookie: cookies.owner!, "Content-Type": "application/json" }, body: JSON.stringify({ status: "done" }) });
        expect(crossProject.status).toBe(404);
        const response = await api(`/issues/${issueId}`, "member", "PATCH", { status: "in_progress" });
        expect(response.status).toBe(200);
        expect((await (await api("/issues")).json()).data[0].status).toBe("in_progress");
        expect((await api(`/issues/${issueId}`, "member", "PATCH", {})).status).toBe(400);
    }, 30000);
    test("comments persist with the author and enforce read-only access", async () => {
        expect((await api(`/issues/${issueId}/comments`, "viewer", "POST", { content: "No" })).status).toBe(403);
        expect((await api(`/issues/${issueId}/comments`, "member", "POST", { content: "Ready for review" })).status).toBe(201);
        const { data } = await (await api(`/issues/${issueId}/comments`, "viewer")).json();
        expect(data[0].content).toBe("Ready for review");
        expect(data[0].name).toBe("Test member");
    }, 30000);
    test("member management lists eligible people and enforces roles", async () => {
        expect((await (await api("/member-candidates")).json()).data.map((item: { userId: string }) => item.userId)).toEqual([ids.candidate]);
        expect((await api("/members", "viewer", "POST", { userId: ids.candidate, role: "member" })).status).toBe(403);
        expect((await api("/members", "owner", "POST", { userId: ids.candidate, role: "member" })).status).toBe(201);
        expect((await (await api("/member-candidates")).json()).data).toHaveLength(0);
        expect((await api(`/members/${ids.candidate}`, "owner", "PATCH", { role: "viewer" })).status).toBe(200);
        expect((await api(`/members/${ids.owner}`, "owner", "DELETE")).status).toBe(403);
    }, 30000);
    test("removing a member clears only their project assignments", async () => {
        expect((await api(`/issues/${issueId}`, "owner", "PATCH", { assignedTo: ids.candidate })).status).toBe(200);
        expect((await api(`/members/${ids.candidate}`, "owner", "DELETE")).status).toBe(200);
        expect((await (await api("/issues")).json()).data[0].assignedTo).toBeNull();
        expect((await (await api("/member-candidates")).json()).data).toHaveLength(1);
    }, 30000);
    test("project settings save for owners and stay read-only for viewers", async () => {
        expect((await api("", "viewer", "PATCH", { name: "Not permitted" })).status).toBe(403);
        expect((await api("", "owner", "PATCH", { name: "Renamed test project" })).status).toBe(200);
        expect((await (await api("")).json()).data.project.name).toBe("Renamed test project");
    }, 30000);
    test("only owners/admins delete issues, cascading their comments", async () => {
        expect((await api(`/issues/${issueId}`, "member", "DELETE")).status).toBe(403);
        expect((await api(`/issues/${issueId}`, "owner", "DELETE")).status).toBe(204);
        expect((await (await api("/issues")).json()).data).toHaveLength(0);
        expect((await database.db.$client.query("SELECT id FROM comments")).rows).toHaveLength(0);
    }, 30000);
    async function workspaceApi(path: string, user = "owner", method = "GET", body?: unknown) {
        return fetch(`${base}/api/workspaces/${ids.workspace}${path}`, { method, headers: { "Content-Type": "application/json", Cookie: cookies[user] || "" }, body: body === undefined ? undefined : JSON.stringify(body) });
    }
    test("workspace dashboard scopes projects and real totals to the current member", async () => {
        expect((await workspaceApi("/dashboard", "outsider")).status).toBe(404);
        const owner = (await (await workspaceApi("/dashboard")).json()).data;
        expect(owner.projects).toHaveLength(2);
        expect(owner.members).toHaveLength(4);
        expect(owner.projects.find((p: { id: string }) => p.id === ids.project).issueCount).toBe(0);
        const viewer = (await (await workspaceApi("/dashboard", "viewer")).json()).data;
        expect(viewer.projects).toHaveLength(1);
        expect(viewer.projects[0].id).toBe(ids.project);
    }, 30000);
    test("workspace member administration validates membership and protects owners", async () => {
        expect((await workspaceApi("/members", "member", "POST", { email: "outsider@example.test" })).status).toBe(403);
        expect((await workspaceApi("/members", "owner", "POST", { email: "missing@example.test" })).status).toBe(404);
        expect((await workspaceApi("/members", "owner", "POST", { email: "OUTSIDER@example.test", role: "member" })).status).toBe(201);
        expect((await workspaceApi("/members", "owner", "POST", { email: "outsider@example.test" })).status).toBe(409);
        expect((await workspaceApi(`/members/${ids.owner}`, "owner", "DELETE")).status).toBe(403);
        expect((await workspaceApi(`/members/${ids.owner}`, "owner", "PATCH", { role: "viewer" })).status).toBe(403);
        expect((await workspaceApi(`/members/${ids.outsider}`, "owner", "PATCH", { role: "viewer" })).status).toBe(200);
        expect((await workspaceApi("/projects", "outsider", "POST", { name: "Denied" })).status).toBe(403);
        expect((await workspaceApi(`/members/${ids.outsider}`, "owner", "DELETE")).status).toBe(204);
        expect((await workspaceApi("/dashboard", "outsider")).status).toBe(404);
    }, 30000);
    test("workspace removal revokes project access and clears assignments", async () => {
        const response = await api("/issues", "owner", "POST", { title: "Unassign on workspace removal", assignedTo: ids.member });
        expect(response.status).toBe(201);
        expect((await workspaceApi(`/members/${ids.member}`, "owner", "DELETE")).status).toBe(204);
        expect((await api("/issues", "member")).status).toBe(404);
        expect((await (await api("/issues")).json()).data[0].assignedTo).toBeNull();
    }, 30000);

    test("email invitations enforce identity, single use, and persist membership", async () => {
        expect((await workspaceApi("/invitations", "candidate", "POST", { email: "outsider@example.test" })).status).toBe(403);
        const sent = await workspaceApi("/invitations", "owner", "POST", { email: "outsider@example.test", role: "viewer" });
        expect(sent.status).toBe(201); expect(invitationToken.length).toBe(64);
        const invite = (await sent.json()).data;
        expect(invite.tokenHash).toBeUndefined();
        const preview = await fetch(`${base}/api/invitations/${invitationToken}`); expect(preview.status).toBe(200);
        const accept = (user: string) => fetch(`${base}/api/invitations/${invitationToken}/accept`, { method: "POST", headers: { Cookie: cookies[user]! } });
        expect((await accept("owner")).status).toBe(403);
        expect((await accept("outsider")).status).toBe(200);
        expect((await accept("outsider")).status).toBe(410);
        expect((await workspaceApi("/dashboard", "outsider")).status).toBe(200);
    }, 30000);
    test("failed delivery and revocation cannot be accepted", async () => {
        failEmail = true;
        expect((await workspaceApi("/invitations", "owner", "POST", { email: "new@example.test" })).status).toBe(502);
        expect((await fetch(`${base}/api/invitations/${invitationToken}`)).status).toBe(410);
        failEmail = false;
        const sent = await workspaceApi("/invitations", "owner", "POST", { email: "revoked@example.test" });
        expect(sent.status).toBe(201);
        const invite = (await sent.json()).data;
        expect((await workspaceApi(`/invitations/${invite.id}`, "owner", "DELETE")).status).toBe(204);
        expect((await fetch(`${base}/api/invitations/${invitationToken}`)).status).toBe(410);
    }, 30000);
    test("notifications persist, protect recipients, and support read/unread", async () => {
        await api("/issues", "owner", "POST", { title: "Notify the project" });
        const inbox = async (user: string) => fetch(`${base}/api/notifications`, { headers: { Cookie: cookies[user]! } });
        const owner = (await (await inbox("owner")).json()).data;
        expect(owner.unreadCount).toBeGreaterThan(0);
        const item = owner.items[0];
        expect((await fetch(`${base}/api/notifications/${item.id}`, { method:"PATCH", headers:{Cookie:cookies.outsider!,"Content-Type":"application/json"},body:JSON.stringify({read:true}) })).status).toBe(404);
        expect((await fetch(`${base}/api/notifications/read-all`, {method:"POST",headers:{Cookie:cookies.owner!}})).status).toBe(204);
        expect((await (await inbox("owner")).json()).data.unreadCount).toBe(0);
        expect((await fetch(`${base}/api/notifications/${item.id}`, {method:"PATCH",headers:{Cookie:cookies.owner!,"Content-Type":"application/json"},body:JSON.stringify({read:false})})).status).toBe(200);
        expect((await (await inbox("owner")).json()).data.unreadCount).toBe(1);
    }, 30000);

    test("live stream delivers a committed change from another session", async () => {
        const controller = new AbortController();
        const response = await fetch(`${base}/api/events`, { headers: { Cookie: cookies.owner! }, signal: controller.signal });
        expect(response.headers.get("content-type")).toContain("text/event-stream");
        const reader = response.body!.getReader();
        async function change() { let text = ""; while (!text.includes("event: change")) { const chunk = await reader.read(); if (chunk.done) throw new Error("Stream closed"); text += new TextDecoder().decode(chunk.value); } return text; }
        try {
            const first = await change();
            await api("/issues", "member", "POST", { title: "Live update from a teammate" });
            // This test is also valid after membership-removal tests: use the owner if necessary.
            await api("/issues", "owner", "POST", { title: "Live persisted update" });
            const next = await change();
            expect(next).not.toBe(first);
        } finally { controller.abort(); await reader.cancel().catch(() => {}); }
    }, 30000);

    test("workspace creators and delegated admins manage only their workspace and its projects", async () => {
        async function call(path: string, user: string, method = "GET", body?: unknown) {
            return fetch(`${base}/api${path}`, { method, headers: { Cookie: cookies[user]!, "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body) });
        }
        const first = await call("/workspaces", "owner", "POST", { name: "Hierarchy A", slug: `hierarchy-a-${schema.slice(-12)}` });
        const second = await call("/workspaces", "candidate", "POST", { name: "Hierarchy B", slug: `hierarchy-b-${schema.slice(-12)}` });
        expect(first.status).toBe(201); expect(second.status).toBe(201);
        const a = (await first.json()).data.id;
        const b = (await second.json()).data.id;
        expect((await (await call(`/workspaces/${a}`, "owner")).json()).data.role).toBe("owner");
        for (const person of ["member", "candidate", "viewer", "outsider"]) {
            expect((await call(`/workspaces/${a}/members`, "owner", "POST", { email: `${person}@example.test`, role: person === "member" ? "admin" : "member" })).status).toBe(201);
        }
        expect((await call(`/workspaces/${a}/members/${ids.owner}`, "member", "PATCH", { role: "member" })).status).toBe(403);
        expect((await call(`/workspaces/${a}/members/${ids.viewer}`, "member", "PATCH", { role: "admin" })).status).toBe(403);
        expect((await call(`/workspaces/${b}/dashboard`, "member")).status).toBe(404);
        expect((await call(`/workspaces/${b}/members`, "member", "POST", { email: "viewer@example.test" })).status).toBe(404);

        // Projects created by another member still fall under workspace authority.
        const created = [];
        for (const name of ["Project P", "Project Q"]) {
            const response = await call(`/workspaces/${a}/projects`, "candidate", "POST", { name });
            expect(response.status).toBe(201);
            created.push((await response.json()).data.project.id);
        }
        const [p, q] = created;
        for (const manager of ["owner", "member"]) {
            const access = (await (await call(`/projects/${p}`, manager)).json()).data;
            expect(access.role).toBe(manager === "owner" ? "owner" : "admin");
            expect(access.canManageAdmins).toBe(true);
            expect((await (await call(`/workspaces/${a}/dashboard`, manager)).json()).data.projects).toHaveLength(2);
            expect((await (await call(`/workspaces/${a}/projects`, manager)).json()).data).toHaveLength(2);
        }
        expect((await call(`/projects/${p}/members`, "member", "POST", { userId: ids.viewer, role: "admin" })).status).toBe(201);
        expect((await call(`/projects/${p}/members`, "owner", "POST", { userId: ids.outsider, role: "viewer" })).status).toBe(201);
        expect((await call(`/projects/${q}/members`, "member", "POST", { userId: ids.outsider, role: "admin" })).status).toBe(201);
        expect((await call(`/projects/${q}`, "viewer")).status).toBe(404);
        expect((await call(`/workspaces/${a}/members`, "viewer", "POST", { email: "member@example.test" })).status).toBe(403);
        expect((await (await call(`/workspaces/${a}/dashboard`, "viewer")).json()).data.projects.map((item: { id: string }) => item.id)).toEqual([p]);
        expect((await (await call(`/projects/${p}`, "viewer")).json()).data.canManageAdmins).toBe(false);
        expect((await (await call(`/projects/${p}`, "outsider")).json()).data.role).toBe("viewer");
        expect((await (await call(`/projects/${q}`, "outsider")).json()).data.role).toBe("admin");
        expect((await call(`/projects/${p}/members/${ids.outsider}`, "viewer", "PATCH", { role: "admin" })).status).toBe(403);
        expect((await call(`/projects/${p}/members`, "viewer", "POST", { userId: ids.member, role: "admin" })).status).toBe(403);
        expect((await call(`/projects/${p}/members/${ids.viewer}`, "viewer", "DELETE")).status).toBe(403);
        expect((await call(`/projects/${p}/members/${ids.candidate}`, "member", "DELETE")).status).toBe(403);
        expect((await call(`/projects/${p}/members/${ids.outsider}`, "viewer", "PATCH", { role: "member" })).status).toBe(200);
        expect((await call(`/projects/${p}/members/${ids.outsider}`, "member", "PATCH", { role: "admin" })).status).toBe(200);
        expect((await call(`/projects/${p}/members/${ids.outsider}`, "viewer", "PATCH", { role: "member" })).status).toBe(403);
        expect((await call(`/projects/${p}/members/${ids.outsider}`, "viewer", "DELETE")).status).toBe(403);
        expect((await call(`/projects/${p}/members/${ids.outsider}`, "member", "DELETE")).status).toBe(200);

        // Demotion removes inherited access immediately; explicit project teams survive.
        expect((await call(`/workspaces/${a}/members/${ids.member}`, "owner", "PATCH", { role: "member" })).status).toBe(200);
        expect((await call(`/projects/${p}`, "member")).status).toBe(404);
        expect((await (await call(`/workspaces/${a}/dashboard`, "member")).json()).data.projects).toHaveLength(0);
        // Simulate a stale project row: workspace membership remains mandatory.
        const { db, schemas, and, eq } = database;
        await db.delete(schemas.workspaceMembers).where(and(eq(schemas.workspaceMembers.workspaceId, a), eq(schemas.workspaceMembers.userId, ids.viewer)));
        expect((await call(`/projects/${p}`, "viewer")).status).toBe(404);
        expect((await call(`/projects/${p}/members`, "viewer")).status).toBe(404);
        expect((await call(`/projects/${p}/issues`, "viewer")).status).toBe(404);
        expect((await call(`/projects/${q}`, "member", "DELETE")).status).toBe(404);
        expect((await call(`/projects/${q}`, "owner", "DELETE")).status).toBe(200);
    }, 180000);

});
