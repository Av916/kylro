import crypto from "node:crypto";

/**
 * Generates a cryptographically secure random token in hexadecimal format.
 * Defaults to 32 bytes (256 bits of entropy).
 */
export function generateRandomToken(bytes = 32): string {
    return crypto.randomBytes(bytes).toString("hex");
}

/**
 * Computes a SHA-256 hash of a plain token string.
 * Used for database storage of session tokens and magic link tokens.
 */
export function hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Compares two strings in constant time to prevent timing attacks.
 * Used for comparing sensitive inputs such as OAuth state tokens.
 */
export function timingSafeCompare(a?: string | null, b?: string | null): boolean {
    if (!a || !b || typeof a !== "string" || typeof b !== "string") {
        return false;
    }

    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);

    if (bufA.length !== bufB.length) {
        return false;
    }

    return crypto.timingSafeEqual(bufA, bufB);
}
