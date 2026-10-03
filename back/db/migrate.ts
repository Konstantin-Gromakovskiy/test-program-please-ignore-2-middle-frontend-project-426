import path from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./index.js";

const MIGRATIONS_FOLDER = path.resolve(process.cwd(), "drizzle");
const MAX_ATTEMPTS = 10;
const RETRY_DELAY_MS = 1000;

// база в docker compose может стартовать позже бэкенда, поэтому повторяем попытки
export async function runMigrations() {
  for (let attempt = 1; ; attempt++) {
    try {
      await migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });
      return;
    } catch (error) {
      if (attempt >= MAX_ATTEMPTS) throw error;
      console.warn(
        `Миграция не удалась (попытка ${attempt}/${MAX_ATTEMPTS}), повтор через ${RETRY_DELAY_MS} мс`,
        error,
      );
      await sleep(RETRY_DELAY_MS);
    }
  }
}
