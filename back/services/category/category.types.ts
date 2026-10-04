import type { Category } from "#domain/category/types.js";

export interface CategoryRepository {
  getCategories(): Promise<Category[]>;
}
