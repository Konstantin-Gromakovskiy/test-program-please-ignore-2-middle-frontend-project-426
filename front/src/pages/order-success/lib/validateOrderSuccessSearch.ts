import type { OrderSuccessSearch } from "../model/types";

export const validateOrderSuccessSearch = (
  search: Record<string, unknown>,
): OrderSuccessSearch => ({
  orderId: typeof search["orderId"] === "string" ? search["orderId"] : "",
});
