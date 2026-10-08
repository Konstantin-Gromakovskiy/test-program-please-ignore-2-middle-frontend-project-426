import { and, inArray, isNull, eq } from "drizzle-orm";
import { categories, db, products } from "./index.js";

type SeedProduct = {
  name: string;
  description: string;
  price: number;
  stock: number;
};

const getImageUrl = (slug: string, name: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(`${slug}-${name}`)}/400/300`;

const SEED_CATEGORIES = [
  { slug: "cpu", name: "Процессоры" },
  { slug: "gpu", name: "Видеокарты" },
  { slug: "ram", name: "Оперативная память" },
  { slug: "ssd", name: "Накопители" },
  { slug: "psu", name: "Блоки питания" },
  { slug: "cooling", name: "Охлаждение" },
];

// Цены в копейках. stock: 0 — товар недоступен.
// imageUrl генерируется из категории и названия (см. getImageUrl).
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
    {
      name: "AMD Ryzen 5 5600",
      description: "6 ядер, 12 потоков, сокет AM4, до 4,4 ГГц",
      price: 1099000,
      stock: 40,
    },
    {
      name: "AMD Ryzen 9 7950X",
      description: "16 ядер, 32 потока, сокет AM5, до 5,7 ГГц",
      price: 5999000,
      stock: 5,
    },
    {
      name: "Intel Core i3-12100F",
      description: "4 ядра, 8 потоков, сокет LGA1700, бюджетный вариант",
      price: 749000,
      stock: 50,
    },
    {
      name: "Intel Core i9-14900K",
      description: "24 ядра, 32 потока, сокет LGA1700, до 6,0 ГГц",
      price: 5799000,
      stock: 0,
    },
    {
      name: "AMD Ryzen 7 5700X",
      description: "8 ядер, 16 потоков, сокет AM4, до 4,6 ГГц",
      price: 1449000,
      stock: 20,
    },
    {
      name: "Intel Core i5-14600K",
      description: "14 ядер, 20 потоков, сокет LGA1700, разблокированный множитель",
      price: 3199000,
      stock: 14,
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
    {
      name: "NVIDIA GeForce RTX 4090 24 ГБ",
      description: "Флагманская видеокарта, 24 ГБ GDDR6X, для 4K и ИИ-задач",
      price: 22999000,
      stock: 0,
    },
    {
      name: "NVIDIA GeForce RTX 4080 SUPER 16 ГБ",
      description: "Видеокарта для игр в 4K, 16 ГБ GDDR6X, DLSS 3",
      price: 11999000,
      stock: 4,
    },
    {
      name: "NVIDIA GeForce GTX 1650 4 ГБ",
      description: "Видеокарта начального уровня, 4 ГБ GDDR6, без доп. питания",
      price: 1499000,
      stock: 27,
    },
    {
      name: "AMD Radeon RX 7600 8 ГБ",
      description: "Видеокарта для игр в Full HD, 8 ГБ GDDR6, FSR 3",
      price: 2799000,
      stock: 16,
    },
    {
      name: "AMD Radeon RX 7900 XTX 24 ГБ",
      description: "Видеокарта для игр в 4K, 24 ГБ GDDR6, FSR 3",
      price: 9499000,
      stock: 6,
    },
    {
      name: "NVIDIA GeForce RTX 3060 12 ГБ",
      description: "Видеокарта для игр в Full HD и QHD, 12 ГБ GDDR6",
      price: 2699000,
      stock: 21,
    },
    {
      name: "Intel Arc A750 8 ГБ",
      description: "Видеокарта для игр в Full HD, 8 ГБ GDDR6, XeSS",
      price: 2199000,
      stock: 10,
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
    {
      name: "G.Skill Trident Z5 RGB 64 ГБ DDR5-6400",
      description: "Комплект 2x32 ГБ, DDR5, 6400 МГц, CL32, RGB-подсветка",
      price: 2399000,
      stock: 7,
    },
    {
      name: "Kingston FURY Beast 8 ГБ DDR4-3200",
      description: "Модуль 1x8 ГБ, DDR4, 3200 МГц, CL16",
      price: 189000,
      stock: 60,
    },
    {
      name: "Patriot Viper Steel 32 ГБ DDR4-3600",
      description: "Комплект 2x16 ГБ, DDR4, 3600 МГц, CL18",
      price: 649000,
      stock: 24,
    },
    {
      name: "Corsair Dominator Platinum 64 ГБ DDR5-6200",
      description: "Комплект 2x32 ГБ, DDR5, 6200 МГц, CL36, радиатор с RGB",
      price: 3199000,
      stock: 0,
    },
    {
      name: "Samsung SO-DIMM 16 ГБ DDR4-3200",
      description: "Модуль для ноутбуков, 1x16 ГБ, DDR4, 3200 МГц",
      price: 329000,
      stock: 18,
    },
    {
      name: "Crucial Pro 32 ГБ DDR5-5600",
      description: "Комплект 2x16 ГБ, DDR5, 5600 МГц, CL46",
      price: 799000,
      stock: 29,
    },
  ],
  ssd: [
    {
      name: "Samsung 980 PRO 1 ТБ NVMe",
      description: "M.2 2280, PCIe 4.0 x4, чтение до 7000 МБ/с",
      price: 1099000,
      stock: 33,
    },
    {
      name: "WD Blue SN580 500 ГБ NVMe",
      description: "M.2 2280, PCIe 4.0 x4, чтение до 4000 МБ/с",
      price: 459000,
      stock: 45,
    },
    {
      name: "Kingston NV2 2 ТБ NVMe",
      description: "M.2 2280, PCIe 4.0 x4, чтение до 3500 МБ/с",
      price: 1349000,
      stock: 26,
    },
    {
      name: "Crucial T700 2 ТБ NVMe",
      description: "M.2 2280, PCIe 5.0 x4, чтение до 12400 МБ/с",
      price: 3299000,
      stock: 5,
    },
    {
      name: "Samsung 870 EVO 1 ТБ SATA",
      description: "2,5 дюйма, SATA III, чтение до 560 МБ/с",
      price: 999000,
      stock: 31,
    },
    {
      name: "Seagate Barracuda 2 ТБ HDD",
      description: "3,5 дюйма, SATA III, 7200 об/мин, кэш 256 МБ",
      price: 559000,
      stock: 38,
    },
    {
      name: "WD Red Plus 8 ТБ HDD",
      description: "3,5 дюйма, SATA III, для NAS, 5640 об/мин",
      price: 1899000,
      stock: 0,
    },
    {
      name: "Kingston A400 240 ГБ SATA",
      description: "2,5 дюйма, SATA III, чтение до 500 МБ/с",
      price: 219000,
      stock: 70,
    },
    {
      name: "Samsung 990 PRO 4 ТБ NVMe",
      description: "M.2 2280, PCIe 4.0 x4, чтение до 7450 МБ/с",
      price: 3999000,
      stock: 9,
    },
  ],
  psu: [
    {
      name: "Corsair RM750e 750 Вт",
      description: "80 PLUS Gold, полностью модульный, ATX 3.0",
      price: 1299000,
      stock: 19,
    },
    {
      name: "be quiet! Pure Power 12 M 650 Вт",
      description: "80 PLUS Gold, модульный, тихий вентилятор 120 мм",
      price: 1049000,
      stock: 23,
    },
    {
      name: "DeepCool PK500D 500 Вт",
      description: "80 PLUS Bronze, немодульный, бюджетный вариант",
      price: 459000,
      stock: 42,
    },
    {
      name: "Seasonic Focus GX-850 850 Вт",
      description: "80 PLUS Gold, полностью модульный, гарантия 10 лет",
      price: 1699000,
      stock: 13,
    },
    {
      name: "Corsair HX1200 1200 Вт",
      description: "80 PLUS Platinum, полностью модульный, для мощных систем",
      price: 2799000,
      stock: 0,
    },
    {
      name: "Thermaltake Toughpower GF3 1000 Вт",
      description: "80 PLUS Gold, ATX 3.0, разъём 12VHPWR",
      price: 2099000,
      stock: 8,
    },
    {
      name: "Chieftec Eco 600 Вт",
      description: "80 PLUS Bronze, немодульный, 120 мм вентилятор",
      price: 389000,
      stock: 36,
    },
    {
      name: "MSI MAG A650BN 650 Вт",
      description: "80 PLUS Bronze, немодульный, защита от перегрузок",
      price: 549000,
      stock: 28,
    },
  ],
  cooling: [
    {
      name: "DeepCool AK400",
      description: "Башенный кулер, 4 тепловые трубки, до 220 Вт TDP",
      price: 289000,
      stock: 47,
    },
    {
      name: "Noctua NH-D15",
      description: "Двухбашенный кулер, 2 вентилятора 140 мм, очень тихий",
      price: 1099000,
      stock: 15,
    },
    {
      name: "Arctic Liquid Freezer II 360",
      description: "СЖО 360 мм, три вентилятора 120 мм, помпа с шумоизоляцией",
      price: 1149000,
      stock: 12,
    },
    {
      name: "Cooler Master Hyper 212 Black",
      description: "Башенный кулер, 4 тепловые трубки, вентилятор 120 мм",
      price: 329000,
      stock: 32,
    },
    {
      name: "NZXT Kraken Elite 360",
      description: "СЖО 360 мм, LCD-экран на помпе, три вентилятора 120 мм",
      price: 2899000,
      stock: 6,
    },
    {
      name: "Arctic P12 PWM, 5 шт.",
      description: "Набор из 5 корпусных вентиляторов 120 мм с PWM",
      price: 219000,
      stock: 55,
    },
    {
      name: "Thermal Grizzly Kryonaut 1 г",
      description: "Термопаста высокой теплопроводности, шприц 1 г",
      price: 59000,
      stock: 90,
    },
    {
      name: "Be quiet! Dark Rock Pro 5",
      description: "Двухбашенный кулер, 7 тепловых трубок, до 270 Вт TDP",
      price: 1099000,
      stock: 0,
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
      .map((item) => ({
        ...item,
        categoryId,
        imageUrl: getImageUrl(slug, item.name),
      }));
  });

  if (newProducts.length > 0) await db.insert(products).values(newProducts);

  // Проставляем изображения товарам, добавленным до появления поля image_url
  for (const [slug, items] of Object.entries(SEED_PRODUCTS)) {
    const categoryId = categoryIdBySlug.get(slug);
    if (!categoryId) continue;

    for (const item of items) {
      await db
        .update(products)
        .set({ imageUrl: getImageUrl(slug, item.name) })
        .where(
          and(
            eq(products.categoryId, categoryId),
            eq(products.name, item.name),
            isNull(products.imageUrl),
          ),
        );
    }
  }
};
