import { expect, test } from "bun:test";
import { connectDatabaseWithRetry } from "../apps/api/src/shared/utils/databaseStartup";

test("retries nested DNS failures and connects after recovery", async () => {
    let attempts = 0; const delays: number[] = [];
    await connectDatabaseWithRetry(async () => { if (++attempts < 3) throw new Error("Query failed", { cause: { code: "ETIMEOUT" } }); }, { maxAttempts: 5, wait: async ms => { delays.push(ms); } });
    expect(attempts).toBe(3); expect(delays).toEqual([1000, 2000]);
});
test("authentication failures stop immediately", async () => {
    let attempts = 0;
    await expect(connectDatabaseWithRetry(async () => { attempts++; throw { code: "28P01" }; }, { maxAttempts: 5, wait: async () => {} })).rejects.toEqual({ code: "28P01" });
    expect(attempts).toBe(1);
});
test("production retry limit is respected", async () => {
    let attempts = 0;
    await expect(connectDatabaseWithRetry(async () => { attempts++; throw { code: "ECONNREFUSED" }; }, { maxAttempts: 3, wait: async () => {} })).rejects.toEqual({ code: "ECONNREFUSED" });
    expect(attempts).toBe(3);
});
