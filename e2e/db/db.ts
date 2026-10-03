import pg from "pg";
import dotenv from "dotenv";
import path from "node:path";
dotenv.config({ path: path.resolve(import.meta.dirname, "../../.env") });

// в CI DATABASE_URL указывает на хост docker-сети, поэтому тесты берут отдельный адрес
const url = process.env.E2E_DATABASE_URL ?? process.env.DATABASE_URL;

export async function resetDb() {
  if (!url) throw new Error("E2E_DATABASE_URL или DATABASE_URL не задан");
  // защита от случайного запуска против чужой базы
  if (!/localhost|127\.0\.0\.1/.test(url)) {
    throw new Error(`Url is not localhost or 127.0.0.1: ${url}`);
  }

  const client = new pg.Client({ connectionString: url });
  await client.connect();
  try {
    const { rows } = await client.query<{ tablename: string }>(
      `select tablename from pg_tables where schemaname = 'public'`,
    );
    if (rows.length > 0) {
      const tables = rows.map((r) => `"public"."${r.tablename}"`).join(", ");
      await client.query(`TRUNCATE ${tables} RESTART IDENTITY CASCADE`);
    }
  } finally {
    await client.end();
  }
}
