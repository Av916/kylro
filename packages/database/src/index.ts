import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import env from "./env.js";

import * as schemas from "./schemas/index.js";

const pool = new Pool({
    connectionString: env.DATABASE_URL,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    max: 10,
});
// A dropped idle connection must not crash the process. pg removes it from the pool.
pool.on("error", (error: Error & { code?: string }) => console.error(`Idle database connection closed (${error.code || "connection error"}). Future queries will reconnect.`));
export const db: NodePgDatabase & { $client: Pool } = drizzle({ client: pool });

export { schemas };

// Re-exported so consumers build queries with this package's drizzle instance
// rather than resolving a second copy of the ORM.
export * from "drizzle-orm";
