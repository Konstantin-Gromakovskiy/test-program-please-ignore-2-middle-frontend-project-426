import { createFileRoute } from "@tanstack/react-router";
import {
  OrderSuccessPage,
  validateOrderSuccessSearch,
} from "@/pages/order-success";

export const Route = createFileRoute("/_authenticated/checkout_/success")({
  validateSearch: validateOrderSuccessSearch,
  component: OrderSuccessPage,
});
