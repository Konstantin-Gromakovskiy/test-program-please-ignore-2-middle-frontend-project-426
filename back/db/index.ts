import { drizzle } from "drizzle-orm/node-postgres";

const databaseUrl = process.env?.["DATABASE_URL"];

if (!databaseUrl) throw new Error("DATABASE_URL is not defined");

export const db = drizzle(databaseUrl);
export type Db = typeof db;
export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
export type DbOrTx = Db | Tx;
export * from "./schemes/index.js";
