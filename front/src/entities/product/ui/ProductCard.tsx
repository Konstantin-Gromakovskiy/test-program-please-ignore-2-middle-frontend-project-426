import { Anchor, Badge, Card, Group, Text } from "@mantine/core";
import type { ProductCardProps } from "../model/types";

export function ProductCard({
  name,
  description,
  categoryName,
  price,
  inStock,
}: ProductCardProps) {
  return (
    <Card withBorder padding="md" data-testid="catalog-item">
      <Group justify="space-between" align="flex-start" mb="xs">
        <Anchor
          fw={600}
          href="#"
          onClick={(event) => event.preventDefault()}
          data-testid="catalog-item-name"
        >
          {name}
        </Anchor>
        <Badge
          color={inStock ? "green" : "gray"}
          data-testid="catalog-item-availability"
          data-available={inStock}
        >
          {inStock ? "В наличии" : "Нет в наличии"}
        </Badge>
      </Group>
      <Text size="sm" c="dimmed" mb="xs">
        {categoryName}
      </Text>
      <Text size="sm" mb="md">
        {description}
      </Text>
      <Text fw={700} data-testid="catalog-item-price">
        {price}
      </Text>
    </Card>
  );
}
