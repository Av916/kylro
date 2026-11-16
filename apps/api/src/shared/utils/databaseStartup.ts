const transientCodes = new Set(["ETIMEOUT", "ETIMEDOUT", "EAI_AGAIN", "ENOTFOUND", "ECONNREFUSED", "ECONNRESET", "EHOSTUNREACH", "ENETUNREACH", "08000", "08001", "08003", "08006", "57P03", "53300"]);
export function databaseErrorCode(error: unknown): string | undefined {
    let current = error;
    for (let depth = 0; depth < 8 && current && typeof current === "object"; depth++) {
        const value = current as { code?: unknown; cause?: unknown };
        if (typeof value.code === "string") return value.code;
        current = value.cause;
    }
    return undefined;
}
export async function connectDatabaseWithRetry(check: () => Promise<unknown>, options: {
    maxAttempts: number;
    wait?: (ms: number) => Promise<void>;
    warn?: (message: string) => void;
}) {
    const wait = options.wait || (ms => new Promise(resolve => setTimeout(resolve, ms)));
    for (let attempt = 1; ; attempt++) {
        try { await check(); return; }
        catch (error) {
            const code = databaseErrorCode(error);
            if (!code || !transientCodes.has(code) || attempt >= options.maxAttempts) throw error;
            const delay = Math.min(1000 * 2 ** Math.min(attempt - 1, 5), 15000);
            options.warn?.(`Database connection unavailable (${code}). Retrying in ${delay / 1000}s; attempt ${attempt}. Check network/DNS access to your database host.`);
            await wait(delay);
        }
    }
}
