import { users } from "#db/index.js";

export type NewUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
