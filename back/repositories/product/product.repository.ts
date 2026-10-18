import {
  and,
  asc,
  count,
  eq,
  gt,
  gte,
  ilike,
  lte,
  or,
  inArray,
} from 'drizzle-orm'
import { sql } from 'drizzle-orm'
import type { SQL } from 'drizzle-orm'
import { categories, type DbOrTx, products } from '#db/index.js'
import type {
  Availability,
  Product,
  ProductsFilter,
} from '#domain/product/types.js'

const availabilityCondition = (
  availability: Availability | undefined,
): SQL | undefined => {
  if (availability === 'inStock') return gt(products.stock, 0)
  if (availability === 'outOfStock') return eq(products.stock, 0)

  return undefined
}

const searchCondition = (search: string | undefined): SQL | undefined => {
  const term = search?.trim()
  if (!term) return undefined

  // Экранируем спецсимволы LIKE, чтобы строка искалась как обычный текст
  const pattern = `%${term.replace(/[\\%_]/g, '\\$&')}%`

  return or(
    ilike(products.name, pattern),
    ilike(products.description, pattern),
  )
}

const productColumns = {
  id: products.id,
  name: products.name,
  description: products.description,
  price: products.price,
  stock: products.stock,
  imageUrl: products.imageUrl,
  category: {
    id: categories.id,
    name: categories.name,
    slug: categories.slug,
  },
}

export class ProductRepository {
  constructor(private readonly db: DbOrTx) {}

  async getProductById(id: string): Promise<Product | undefined> {
    const [product] = await this.db
      .select(productColumns)
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.id, id))
      .limit(1)

    return product
  }

  async getProductsByIds(ids: string[], executor: DbOrTx = this.db): Promise<Product[]> {
    return executor
      .select(productColumns)
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(inArray(products.id, ids)).orderBy(asc(products.id)).for('update', { of: products })
  }

  /** Списывает остаток. Вызывать после проверки наличия в той же транзакции. */
  async decreaseStock(id: string, quantity: number) {
    await this.db
      .update(products)
      .set({ stock: sql`${products.stock} - ${quantity}` })
      .where(eq(products.id, id))
  }

  async getProducts({
    categorySlug,
    minPrice,
    maxPrice,
    availability,
    search,
    limit,
    offset,
  }: ProductsFilter): Promise<{ items: Product[]; totalItems: number }> {
    const where = and(
      categorySlug ? eq(categories.slug, categorySlug) : undefined,
      minPrice !== undefined ? gte(products.price, minPrice) : undefined,
      maxPrice !== undefined ? lte(products.price, maxPrice) : undefined,
      availabilityCondition(availability),
      searchCondition(search),
    )

    const [items, [totalRow]] = await Promise.all([
      this.db
        .select(productColumns)
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
    ])

    return { items, totalItems: totalRow?.total ?? 0 }
  }
}
