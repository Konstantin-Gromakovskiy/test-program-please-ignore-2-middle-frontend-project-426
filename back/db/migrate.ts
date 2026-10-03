import path from "node:path";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./index.js";

const MIGRATIONS_FOLDER = path.resolve(process.cwd(), "drizzle");

export const runMigrations = () =>
  migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });
