import { defineHandlers } from "../lib/utils.js";
import type { PromoService } from "#service/index.js";

export const createPromoHandlers = (promoService: PromoService) =>
  defineHandlers({
    getPromos: async (_, reply) => {
      const promos = await promoService.getPromos();

      return reply.code(200).send(promos);
    },
  });
