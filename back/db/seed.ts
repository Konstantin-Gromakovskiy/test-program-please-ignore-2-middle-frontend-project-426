import { inArray } from "drizzle-orm";
import { categories, db, products } from "./index.js";

type SeedProduct = {
  name: string;
  description: string;
  price: number;
  stock: number;
};

const SEED_CATEGORIES = [
  { slug: "cpu", name: "Процессоры" },
  { slug: "gpu", name: "Видеокарты" },
  { slug: "ram", name: "Оперативная память" },
];

// Цены в копейках
const SEED_PRODUCTS: Record<string, SeedProduct[]> = {
  cpu: [
    {
      name: "AMD Ryzen 5 7600",
      description: "6 ядер, 12 потоков, сокет AM5, до 5,1 ГГц",
      price: 1899000,
      stock: 25,
    },
    {
      name: "AMD Ryzen 7 7800X3D",
      description: "8 ядер, 16 потоков, сокет AM5, 3D V-Cache для игр",
      price: 3799000,
      stock: 12,
    },
    {
      name: "Intel Core i5-13400F",
      description: "10 ядер, 16 потоков, сокет LGA1700, без встроенной графики",
      price: 1699000,
      stock: 30,
    },
    {
      name: "Intel Core i7-14700K",
      description: "20 ядер, 28 потоков, сокет LGA1700, разблокированный множитель",
      price: 3999000,
      stock: 8,
    },
  ],
  gpu: [
    {
      name: "NVIDIA GeForce RTX 4060 8 ГБ",
      description: "Видеокарта для игр в Full HD, 8 ГБ GDDR6, DLSS 3",
      price: 3299000,
      stock: 18,
    },
    {
      name: "NVIDIA GeForce RTX 4070 SUPER 12 ГБ",
      description: "Видеокарта для игр в QHD, 12 ГБ GDDR6X, DLSS 3",
      price: 6599000,
      stock: 9,
    },
    {
      name: "AMD Radeon RX 7800 XT 16 ГБ",
      description: "Видеокарта для игр в QHD, 16 ГБ GDDR6, FSR 3",
      price: 5499000,
      stock: 11,
    },
  ],
  ram: [
    {
      name: "Kingston FURY Beast 16 ГБ DDR5-5600",
      description: "Комплект 2x8 ГБ, DDR5, 5600 МГц, CL40",
      price: 489000,
      stock: 40,
    },
    {
      name: "Corsair Vengeance 32 ГБ DDR5-6000",
      description: "Комплект 2x16 ГБ, DDR5, 6000 МГц, CL30, профиль EXPO",
      price: 899000,
      stock: 22,
    },
    {
      name: "Crucial 16 ГБ DDR4-3200",
      description: "Модуль 1x16 ГБ, DDR4, 3200 МГц, CL22",
      price: 359000,
      stock: 35,
    },
  ],
};

export const runSeed = async () => {
  await db
    .insert(categories)
    .values(SEED_CATEGORIES)
    .onConflictDoNothing({ target: categories.slug });

  const categoryRows = await db
    .select({ id: categories.id, slug: categories.slug })
    .from(categories)
    .where(
      inArray(
        categories.slug,
        SEED_CATEGORIES.map(({ slug }) => slug),
      ),
    );
  const categoryIdBySlug = new Map(categoryRows.map((c) => [c.slug, c.id]));

  const existingProducts = await db
    .select({ name: products.name, categoryId: products.categoryId })
    .from(products)
    .where(inArray(products.categoryId, [...categoryIdBySlug.values()]));
  const existingKeys = new Set(
    existingProducts.map((p) => `${p.categoryId}:${p.name}`),
  );

  const newProducts = Object.entries(SEED_PRODUCTS).flatMap(([slug, items]) => {
    const categoryId = categoryIdBySlug.get(slug);
    if (!categoryId) throw new Error(`Категория ${slug} не найдена`);

    return items
      .filter((item) => !existingKeys.has(`${categoryId}:${item.name}`))
      .map((item) => ({ ...item, categoryId }));
  });

  if (newProducts.length > 0) await db.insert(products).values(newProducts);
};
