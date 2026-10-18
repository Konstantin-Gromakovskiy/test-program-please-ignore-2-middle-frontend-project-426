import type { CreateOrderError } from "@/shared/api";
import type { OrderErrorView } from "../model/types";

export const toOrderErrorView = (error: CreateOrderError): OrderErrorView => ({
  message:
    error.status === 409
      ? "Не удалось оформить заказ: на складе не хватает товаров."
      : "Не удалось оформить заказ. Попробуйте еще раз.",
  problems:
    "problems" in error
      ? error.problems.map(
          ({ name, requested, available }) =>
            `${name}: запрошено ${requested}, доступно ${available}`,
        )
      : [],
});
