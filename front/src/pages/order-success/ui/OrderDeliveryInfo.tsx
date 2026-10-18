import { Stack, Text } from "@mantine/core";
import type { OrderDeliveryInfoProps } from "../model/types";

export function OrderDeliveryInfo({ delivery }: OrderDeliveryInfoProps) {
  return (
    <Stack gap="xs" data-testid="order-delivery">
      <Text data-testid="order-delivery-method">
        Способ получения: {delivery.methodLabel}
      </Text>
      <Text data-testid="order-recipient">
        Получатель: {delivery.recipientName}, {delivery.recipientPhone}
      </Text>
      {delivery.address && (
        <Text data-testid="order-address">Адрес: {delivery.address}</Text>
      )}
    </Stack>
  );
}
