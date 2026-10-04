import { db } from "./index.js";
import { runMigrations } from "./migrate.js";
import { runSeed } from "./seed.js";

try {
  await runMigrations();
  await runSeed();
} finally {
  await db.$client.end();
}
