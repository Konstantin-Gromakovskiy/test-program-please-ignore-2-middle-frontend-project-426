import { createFileRoute } from "@tanstack/react-router";
import { OrderSuccessPage } from "@/pages/order-success";

export const Route = createFileRoute("/_authenticated/orders/$orderId")({
  component: OrderSuccessPage,
});
