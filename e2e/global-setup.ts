import type { FullConfig } from "@playwright/test";
import { seedCatalog } from "./db/catalog.js";
import { resetDb } from "./db/db.js";

export default async function globalSetup(_config: FullConfig) {
  await resetDb();
  await seedCatalog();
}
