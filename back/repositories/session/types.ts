import { sessions } from "#db/index.js";

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
