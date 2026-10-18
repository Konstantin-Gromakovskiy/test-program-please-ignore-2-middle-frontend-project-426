import type { Promo } from "#domain/promo/types.js";

export interface PromoRepository {
  getPromos(): Promise<Promo[]>;
}
