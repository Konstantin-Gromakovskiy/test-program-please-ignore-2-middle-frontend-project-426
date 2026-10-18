import { asc, eq, gt } from "drizzle-orm";
import { categories, type Db, products, promos } from "#db/index.js";
import type { Promo } from "#domain/promo/types.js";

export class PromoRepository {
  constructor(private readonly db: Db) {}

  /** Промо в порядке показа; товары без остатка не попадают. */
  async getPromos(): Promise<Promo[]> {
    const rows = await this.db
      .select({
        id: promos.id,
        title: promos.title,
        description: promos.description,
        product: {
          id: products.id,
          name: products.name,
          description: products.description,
          price: products.price,
          stock: products.stock,
          imageUrl: products.imageUrl,
        },
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        },
      })
      .from(promos)
      .innerJoin(products, eq(promos.productId, products.id))
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(gt(products.stock, 0))
      .orderBy(asc(promos.position), asc(promos.id));

    return rows.map(({ id, title, description, product, category }) => ({
      id,
      title,
      description,
      product: { ...product, category },
    }));
  }
}
