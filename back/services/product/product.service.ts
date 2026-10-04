import type { ProductsPage } from "#domain/product/types.js";
import type { GetProductsParams, ProductRepository } from "./product.types.js";

class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getProducts({
    page,
    pageSize,
    categorySlug,
  }: GetProductsParams): Promise<ProductsPage> {
    const { items, totalItems } = await this.productRepository.getProducts({
      categorySlug,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    return {
      items,
      meta: {
        page,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      },
    };
  }
}

export default ProductService;
