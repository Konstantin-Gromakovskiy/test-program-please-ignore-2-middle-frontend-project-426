import { defineHandlers } from "../lib/utils.js";
import type { CategoryService } from "#service/index.js";

export const createCategoryHandlers = (categoryService: CategoryService) =>
  defineHandlers({
    getCategories: async (_, reply) => {
      const categories = await categoryService.getCategories();

      return reply.code(200).send(categories);
    },
  });
