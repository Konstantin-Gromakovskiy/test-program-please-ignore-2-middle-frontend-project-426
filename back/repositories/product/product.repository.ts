import { and, asc, count, eq, gt, gte, lte } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { categories, type Db, products } from "#db/index.js";
import type {
  Availability,
  Product,
  ProductsFilter,
} from "#domain/product/types.js";

const availabilityCondition = (
  availability: Availability | undefined,
): SQL | undefined => {
  if (availability === "inStock") return gt(products.stock, 0);
  if (availability === "outOfStock") return eq(products.stock, 0);

  return undefined;
};

export class ProductRepository {
  constructor(private readonly db: Db) {}

  async getProducts({
    categorySlug,
    minPrice,
    maxPrice,
    availability,
    limit,
    offset,
  }: ProductsFilter): Promise<{ items: Product[]; totalItems: number }> {
    const where = and(
      categorySlug ? eq(categories.slug, categorySlug) : undefined,
      minPrice !== undefined ? gte(products.price, minPrice) : undefined,
      maxPrice !== undefined ? lte(products.price, maxPrice) : undefined,
      availabilityCondition(availability),
    );

    const [items, [totalRow]] = await Promise.all([
      this.db
        .select({
          id: products.id,
          name: products.name,
          description: products.description,
          price: products.price,
          stock: products.stock,
          category: {
            id: categories.id,
            name: categories.name,
            slug: categories.slug,
          },
        })
        .from(products)
        .innerJoin(categories, eq(products.categoryId, categories.id))
        .where(where)
        .orderBy(asc(products.name), asc(products.id))
        .limit(limit)
        .offset(offset),
      this.db
        .select({ total: count() })
        .from(products)
        .innerJoin(categories, eq(products.categoryId, categories.id))
        .where(where),
    ]);

    return { items, totalItems: totalRow?.total ?? 0 };
  }
}
