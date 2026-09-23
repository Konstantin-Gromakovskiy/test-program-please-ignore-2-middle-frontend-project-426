import { type Db, sessions } from "#db/index.js";
import type { NewSession, Session } from "./types.js";
import { eq } from "drizzle-orm";

export class SessionRepository {
  constructor(private readonly db: Db) {}

  async createSession(newSessionData: NewSession) {
    const [session] = await this.db
      .insert(sessions)
      .values(newSessionData)
      .returning();
    if (!session) throw new Error("Session not created");
    return session;
  }

  async getSessionByToken(
    hash: Session["tokenHash"],
  ): Promise<Session | undefined> {
    const session = await this.db
      .select()
      .from(sessions)
      .where(eq(sessions.tokenHash, hash));
    return session?.[0];
  }

  async deleteSession(session: Session): Promise<Session | undefined> {
    const [deletedSession] = await this.db
      .delete(sessions)
      .where(eq(sessions.id, session.id))
      .returning();

    return deletedSession;
  }
}
