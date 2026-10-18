import { Pagination, Stack } from "@mantine/core";
import type { OrdersListProps } from "../model/types";
import { OrderCard } from "./OrderCard";

export function OrdersList({
  orders,
  page,
  totalPages,
  onPageChange,
}: OrdersListProps) {
  return (
    <div>
      <Stack gap="md" data-testid="orders-list">
        {orders.map((order) => (
          <OrderCard key={order.id} {...order} />
        ))}
      </Stack>
      {totalPages > 1 && (
        <Pagination
          mt="lg"
          value={page}
          total={totalPages}
          onChange={onPageChange}
          data-testid="orders-pagination"
        />
      )}
    </div>
  );
}
