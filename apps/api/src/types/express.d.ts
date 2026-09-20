import type { schemas } from "@kylro/database";

export type AuthUser = typeof schemas.users.$inferSelect;
export type AuthSession = typeof schemas.sessions.$inferSelect;

declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
            session?: AuthSession;
        }
    }
}
