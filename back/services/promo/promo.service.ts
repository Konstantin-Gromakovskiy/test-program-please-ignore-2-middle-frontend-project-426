import type { Promo } from "#domain/promo/types.js";
import type { PromoRepository } from "./promo.types.js";

class PromoService {
  constructor(private readonly promoRepository: PromoRepository) {}

  async getPromos(): Promise<Promo[]> {
    return this.promoRepository.getPromos();
  }
}

export default PromoService;
