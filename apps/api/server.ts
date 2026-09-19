import http from "node:http";

import { db } from "@kylro/database";
import createServerApplication from "./src/app.js";

import env from "./src/shared/config/env.js";

async function main() {
    try {
        await db.execute("SELECT 1");
        console.log("Database connected");

        const server = http.createServer(createServerApplication());
        server.listen(env.PORT, () => {
            console.log(`Server started on PORT: ${env.PORT}`);
        });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

main();
