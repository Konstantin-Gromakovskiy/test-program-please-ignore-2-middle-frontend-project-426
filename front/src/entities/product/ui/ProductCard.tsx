import { Anchor, Badge, Card, Group, Image, Stack, Text } from "@mantine/core";
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
      <Group wrap="nowrap" align="stretch" gap="md" h="100%">
        <Image
          src={imageUrl}
          fallbackSrc={IMAGE_FALLBACK}
          alt={name}
          w={{ base: 112, sm: 160 }}
          h="auto"
          mih={112}
          radius="sm"
          fit="cover"
          loading="lazy"
          style={{ flexShrink: 0 }}
          data-testid="catalog-item-image"
        />
        <Stack gap="xs" justify="space-between" style={{ minWidth: 0 }} flex={1}>
          <div>
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
            <Text size="sm">{description}</Text>
          </div>
          <Text fw={700} data-testid="catalog-item-price">
            {price}
          </Text>
        </Stack>
      </Group>
    </Card>
  );
}
