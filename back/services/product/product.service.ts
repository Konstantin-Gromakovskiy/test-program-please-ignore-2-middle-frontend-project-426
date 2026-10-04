import type { ProductsPage } from "#domain/product/types.js";
import { BadRequestError } from "#lib/errors.js";
import type { GetProductsParams, ProductRepository } from "./product.types.js";

class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getProducts({
    page,
    pageSize,
    categorySlug,
    minPrice,
    maxPrice,
  }: GetProductsParams): Promise<ProductsPage> {
    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice)
      throw new BadRequestError("minPrice must not be greater than maxPrice");

    const { items, totalItems } = await this.productRepository.getProducts({
      categorySlug,
      minPrice,
      maxPrice,
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
