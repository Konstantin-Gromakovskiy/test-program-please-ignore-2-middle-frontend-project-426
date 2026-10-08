import { Anchor, Badge, Card, Group, Image, Text } from "@mantine/core";
import type { ProductCardProps } from "../model/types";

const IMAGE_FALLBACK = "https://placehold.co/400x300?text=Нет+фото";

export function ProductCard({
  name,
  description,
  categoryName,
  price,
  inStock,
  imageUrl,
}: ProductCardProps) {
  return (
    <Card withBorder padding="md" data-testid="catalog-item">
      <Card.Section mb="md">
        <Image
          src={imageUrl}
          fallbackSrc={IMAGE_FALLBACK}
          alt={name}
          h={180}
          loading="lazy"
          data-testid="catalog-item-image"
        />
      </Card.Section>
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
