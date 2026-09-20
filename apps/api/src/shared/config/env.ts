import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().int().positive().default(8000),
    CLIENT_URL: z.url(),
    API_URL: z.url().default("http://localhost:8000"),
    DATABASE_URL: z.url(),
    GOOGLE_CLIENT_ID: z.string().default(""),
    GOOGLE_CLIENT_SECRET: z.string().default(""),
    GOOGLE_CALLBACK_URL: z.url().default("http://localhost:8000/api/auth/google/callback"),
    BREVO_API_KEY: z.string().default(""),
    EMAIL_FROM: z.string().default("noreply@klyro.com"),
});

function createEnv(env: NodeJS.ProcessEnv) {
    const safeParseResult = envSchema.safeParse(env);

    if (!safeParseResult.success) throw new Error(safeParseResult.error.message);

    return safeParseResult.data;
}

const env = createEnv(process.env);

export default env;

