import { defineHandlers } from "../lib/utils.js";
import type { ProductService } from "#service/index.js";

export const createProductHandlers = (productService: ProductService) =>
  defineHandlers({
    getProducts: async (request, reply) => {
      const query = request.query;
      const productsPage = await productService.getProducts({
        page: query?.page ?? 1,
        pageSize: query?.pageSize ?? 10,
        categorySlug: query?.categorySlug,
      });

      return reply.code(200).send(productsPage);
    },
  });
