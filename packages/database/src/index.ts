import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import type { Pool } from "pg";
import env from "./env.js";

import * as schemas from "./schemas/index.js";

export const db: NodePgDatabase & { $client: Pool } = drizzle(env.DATABASE_URL);

export { schemas };

// Re-exported so consumers build queries with this package's drizzle instance
// rather than resolving a second copy of the ORM.
export * from "drizzle-orm";
