import type { FullConfig } from "@playwright/test";
import { resetDb } from "./db/db.js";

export default async function globalSetup(_config: FullConfig) {
  await resetDb();
}
