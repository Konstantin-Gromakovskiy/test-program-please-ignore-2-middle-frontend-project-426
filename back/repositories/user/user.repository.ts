import { type Db, users } from "#db/index.js";
import { DrizzleQueryError, eq } from "drizzle-orm";
import type { NewUser, User } from "./types.js";
import { UniqueConstraintError } from "#domain/errors/index.js";

function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof DrizzleQueryError &&
    error.cause instanceof Error &&
    "code" in error.cause &&
    error.cause.code === "23505"
  );
}

export class UserRepository {
  constructor(private readonly db: Db) {}

  async createUser(userData: NewUser): Promise<User> {
    try {
      const [user] = await this.db.insert(users).values(userData).returning();
      if (!user) throw new Error("User not created");
      return user;
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new UniqueConstraintError();
      }

      throw error;
    }
  }
  async getUserByEmail(email: User["email"]): Promise<User | undefined> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    return user;
  }

  async getUserById(id: User["id"]): Promise<User | undefined> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id));

    return user;
  }
}
