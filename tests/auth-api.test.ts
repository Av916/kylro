import { afterEach, expect, test } from "bun:test";
import { API_URL, verifyMagicLink } from "../apps/web/lib/api";

const originalFetch = globalThis.fetch;

afterEach(() => {
    globalThis.fetch = originalFetch;
});

test("magic-link verification sends the token and accepts the session cookie", async () => {
    let requestUrl: unknown;
    let requestOptions: RequestInit | undefined;
    globalThis.fetch = (async (url, options) => {
        requestUrl = url;
        requestOptions = options;
        return Response.json({ data: { user: { id: "user-1" } } });
    }) as typeof fetch;

    const result = await verifyMagicLink("a".repeat(64));

    expect(requestUrl).toBe(`${API_URL}/auth/magic-link/verify`);
    expect(requestOptions).toMatchObject({
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: "a".repeat(64) }),
    });
    expect(result.data.user.id).toBe("user-1");
});

test("expired or reused magic links surface the API error", async () => {
    globalThis.fetch = (async () => Response.json(
        { message: "Invalid, expired, or already used magic link" },
        { status: 401 },
    )) as typeof fetch;

    await expect(verifyMagicLink("a".repeat(64))).rejects.toThrow(
        "Invalid, expired, or already used magic link",
    );
});

test("an unavailable API gives a useful error even without a JSON response", async () => {
    globalThis.fetch = (async () => new Response("Bad gateway", { status: 502 })) as typeof fetch;

    await expect(verifyMagicLink("a".repeat(64))).rejects.toThrow("Please request a new one");
});
