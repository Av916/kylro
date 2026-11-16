import http from "node:http";

import { db } from "@kylro/database";
import createServerApplication from "./src/app.js";

import { connectDatabaseWithRetry, databaseErrorCode } from "./src/shared/utils/databaseStartup.js";
import env from "./src/shared/config/env.js";

async function main() {
    try {
        await connectDatabaseWithRetry(() => db.execute("SELECT 1"), {
            maxAttempts: env.NODE_ENV === "development" ? Infinity : 5,
            warn: message => console.warn(message),
        });
        console.log("Database connected");

        const server = http.createServer(createServerApplication());
        server.listen(env.PORT, () => {
            console.log(`Server started on PORT: ${env.PORT}`);
        });
    } catch (err) {
        console.error(`API startup failed (${databaseErrorCode(err) || "unknown error"}). Check database configuration and connectivity.`);
        await db.$client.end();
        process.exit(1);
    }
}

main();
