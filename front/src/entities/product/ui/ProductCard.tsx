import { Badge, Card, Group, Text } from "@mantine/core";
import type { ProductCardProps } from "../model/types";

export function ProductCard({
  name,
  description,
  categoryName,
  price,
  inStock,
}: ProductCardProps) {
  return (
    <Card withBorder padding="md" data-testid="product-card">
      <Group justify="space-between" align="flex-start" mb="xs">
        <Text fw={600}>{name}</Text>
        <Badge color={inStock ? "green" : "gray"}>
          {inStock ? "В наличии" : "Нет в наличии"}
        </Badge>
      </Group>
      <Text size="sm" c="dimmed" mb="xs">
        {categoryName}
      </Text>
      <Text size="sm" mb="md">
        {description}
      </Text>
      <Text fw={700}>{price}</Text>
    </Card>
  );
}
