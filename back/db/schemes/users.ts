import { integer, varchar, pgTable, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  email: varchar("email"),
  password: varchar("password"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});
