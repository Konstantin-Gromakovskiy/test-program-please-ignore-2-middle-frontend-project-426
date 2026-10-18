import { Card, Image, Stack, Text, Title } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import type { PromoCardProps } from "../model/types";

const IMAGE_FALLBACK = "https://placehold.co/400x300?text=Нет+фото";

export function PromoCard({
  productId,
  title,
  description,
  productName,
  price,
  imageUrl,
}: PromoCardProps) {
  return (
    <Card
      withBorder
      padding="md"
      h="100%"
      renderRoot={(props) => (
        <Link to="/products/$productId" params={{ productId }} {...props} />
      )}
      style={{ textDecoration: "none", color: "inherit" }}
      data-testid="home-promo-item"
    >
      <Card.Section>
        <Image
          src={imageUrl}
          fallbackSrc={IMAGE_FALLBACK}
          alt={productName}
          h={180}
          fit="cover"
        />
      </Card.Section>
      <Stack gap="xs" mt="md">
        <Title order={4} data-testid="home-promo-title">
          {title}
        </Title>
        <Text size="sm" c="dimmed" data-testid="home-promo-description">
          {description}
        </Text>
        <Text size="sm" fw={600} data-testid="home-promo-product">
          {productName}
        </Text>
        <Text fw={700} data-testid="home-promo-price">
          {price}
        </Text>
      </Stack>
    </Card>
  );
}
