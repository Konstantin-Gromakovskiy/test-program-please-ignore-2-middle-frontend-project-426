import { type Db, users } from "#db/index.js";
import { eq } from "drizzle-orm";
import type { NewUser, User } from "./types.js";

export class UserRepository {
  constructor(private readonly db: Db) {}

  async createUser(userData: NewUser): Promise<User> {
    const [user] = await this.db.insert(users).values(userData).returning();
    if (!user) throw new Error("User not created");
    return user;
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
