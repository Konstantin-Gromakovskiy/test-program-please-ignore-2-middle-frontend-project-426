import { asc } from "drizzle-orm";
import { categories, type Db } from "#db/index.js";
import type { Category } from "#domain/category/types.js";

export class CategoryRepository {
  constructor(private readonly db: Db) {}

  async getCategories(): Promise<Category[]> {
    return this.db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      })
      .from(categories)
      .orderBy(asc(categories.name), asc(categories.id));
  }
}
