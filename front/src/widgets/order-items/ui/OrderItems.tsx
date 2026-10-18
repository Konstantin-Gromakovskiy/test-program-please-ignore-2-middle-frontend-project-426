import { Badge, Card, Group, Image, Stack, Text } from "@mantine/core";
import type { OrderItemsProps } from "../model/types";

const IMAGE_FALLBACK = "https://placehold.co/200x150?text=Нет+фото";

export function OrderItems({ rows, total }: OrderItemsProps) {
  return (
    <Stack gap="sm" data-testid="order-items">
      {rows.map((row) => (
        <Card key={row.id} withBorder padding="sm" data-testid="order-item">
          <Group wrap="nowrap" align="center" gap="md">
            <Image
              src={row.imageUrl}
              fallbackSrc={IMAGE_FALLBACK}
              alt={row.name}
              w={56}
              h={56}
              radius="sm"
              fit="cover"
              style={{ flexShrink: 0 }}
            />
            <Stack gap={2} flex={1} style={{ minWidth: 0 }}>
              <Text fw={600} truncate data-testid="order-item-name">
                {row.name}
              </Text>
              <Text size="sm" c="dimmed" data-testid="order-item-qty">
                {row.available === false
                  ? row.unitPrice
                  : `${row.unitPrice} × ${row.quantity}`}
              </Text>
              {row.available === false && (
                <Badge color="red" w="fit-content" data-testid="order-item-unavailable">
                  Нет в наличии
                </Badge>
              )}
            </Stack>
            <Text fw={700} data-testid="order-item-total">
              {row.lineTotal}
            </Text>
          </Group>
        </Card>
      ))}
      <Group justify="flex-end" gap="md">
        <Text size="lg">Итого:</Text>
        <Text size="xl" fw={700} data-testid="order-total">
          {total}
        </Text>
      </Group>
    </Stack>
  );
}
