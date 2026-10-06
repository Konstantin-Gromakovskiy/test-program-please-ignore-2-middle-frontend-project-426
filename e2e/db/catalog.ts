import pg from "pg";
import dotenv from "dotenv";
import path from "node:path";
dotenv.config({ path: path.resolve(import.meta.dirname, "../../.env") });

const url = process.env.E2E_DATABASE_URL ?? process.env.DATABASE_URL;

export interface CatalogCategory {
  slug: string;
  name: string;
}

export interface CatalogProduct {
  name: string;
  description: string;
  /** В копейках, как в API. */
  price: number;
  stock: number;
  categorySlug: string;
}

export const PAGE_SIZE = 10;

export const categories: CatalogCategory[] = [
  { slug: "cpu", name: "Процессоры" },
  { slug: "gpu", name: "Видеокарты" },
  { slug: "ram", name: "Оперативная память" },
];

const product = (
  categorySlug: string,
  name: string,
  price: number,
  stock: number,
): CatalogProduct => ({
  categorySlug,
  name,
  description: `Описание: ${name}`,
  price,
  stock,
});

/** 25 товаров: при размере страницы 10 это три страницы (10 + 10 + 5). */
export const products: CatalogProduct[] = [
  product("cpu", "AMD Ryzen 5 7600", 1899000, 25),
  product("cpu", "AMD Ryzen 7 7800X3D", 3799000, 12),
  product("cpu", "AMD Ryzen 9 7950X", 5999000, 0),
  product("cpu", "Intel Core i3-12100F", 749000, 50),
  product("cpu", "Intel Core i5-13400F", 1699000, 30),
  product("cpu", "Intel Core i7-14700K", 3999000, 8),
  product("gpu", "AMD Radeon RX 7600", 2799000, 16),
  product("gpu", "AMD Radeon RX 7800 XT", 5499000, 11),
  product("gpu", "AMD Radeon RX 7900 XTX", 9499000, 6),
  product("gpu", "Intel Arc A750", 2199000, 10),
  product("gpu", "NVIDIA GeForce GTX 1650", 1499000, 27),
  product("gpu", "NVIDIA GeForce RTX 3060", 2699000, 21),
  product("gpu", "NVIDIA GeForce RTX 4060", 3299000, 18),
  product("gpu", "NVIDIA GeForce RTX 4070 SUPER", 6599000, 9),
  product("gpu", "NVIDIA GeForce RTX 4090", 22999000, 0),
  product("ram", "Corsair Vengeance 32 ГБ DDR5-6000", 899000, 22),
  product("ram", "Crucial 16 ГБ DDR4-3200", 359000, 35),
  product("ram", "Crucial Pro 32 ГБ DDR5-5600", 799000, 29),
  product("ram", "G.Skill Trident Z5 64 ГБ DDR5-6400", 2399000, 7),
  product("ram", "Kingston FURY Beast 8 ГБ DDR4-3200", 189000, 60),
  product("ram", "Kingston FURY Beast 16 ГБ DDR5-5600", 489000, 40),
  product("ram", "Patriot Viper Steel 32 ГБ DDR4-3600", 649000, 24),
  product("ram", "Samsung SO-DIMM 16 ГБ DDR4-3200", 329000, 18),
  product("ram", "Corsair Dominator 64 ГБ DDR5-6200", 3199000, 0),
  product("ram", "Kingston ValueRAM 4 ГБ DDR3-1600", 59000, 15),
];

export async function seedCatalog() {
  if (!url) throw new Error("E2E_DATABASE_URL или DATABASE_URL не задан");

  const client = new pg.Client({ connectionString: url });
  await client.connect();
  try {
    const idBySlug = new Map<string, string>();
    for (const { slug, name } of categories) {
      const { rows } = await client.query<{ id: string }>(
        `insert into categories (slug, name) values ($1, $2) returning id`,
        [slug, name],
      );
      idBySlug.set(slug, rows[0].id);
    }

    for (const item of products) {
      await client.query(
        `insert into products (name, description, price, stock, category_id)
         values ($1, $2, $3, $4, $5)`,
        [
          item.name,
          item.description,
          item.price,
          item.stock,
          idBySlug.get(item.categorySlug),
        ],
      );
    }
  } finally {
    await client.end();
  }
}
