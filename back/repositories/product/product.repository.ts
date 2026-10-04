import { asc, count, eq } from "drizzle-orm";
import { categories, type Db, products } from "#db/index.js";
import type { Product, ProductsFilter } from "#domain/product/types.js";

export class ProductRepository {
  constructor(private readonly db: Db) {}

  async getProducts({
    categorySlug,
    limit,
    offset,
  }: ProductsFilter): Promise<{ items: Product[]; totalItems: number }> {
    const where = categorySlug ? eq(categories.slug, categorySlug) : undefined;

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
