import type { Category } from "#domain/category/types.js";
import type { CategoryRepository } from "./category.types.js";

class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async getCategories(): Promise<Category[]> {
    return this.categoryRepository.getCategories();
  }
}

export default CategoryService;
