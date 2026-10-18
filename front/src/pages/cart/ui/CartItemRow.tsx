import {
  Anchor,
  Badge,
  Button,
  Card,
  Group,
  Image,
  NumberInput,
  Stack,
  Text,
} from "@mantine/core";
import { Link } from "@tanstack/react-router";
import type { CartItemRowProps } from "../model/types";

const IMAGE_FALLBACK = "https://placehold.co/200x150?text=Нет+фото";

export function CartItemRow({
  id,
  name,
  imageUrl,
  unitPrice,
  quantity,
  maxQuantity,
  lineTotal,
  available,
  onQuantityChange,
  onRemove,
}: CartItemRowProps) {
  return (
    <Card withBorder padding="md" data-testid="cart-item">
      {/* На узком экране блок управления переносится под товар */}
      <Group wrap="wrap" align="center" gap="md">
        <Group wrap="nowrap" align="center" gap="md" flex="1 1 240px" miw={0}>
          <Image
            src={imageUrl}
            fallbackSrc={IMAGE_FALLBACK}
            alt={name}
            w={{ base: 72, sm: 120 }}
            h={{ base: 72, sm: 90 }}
            radius="sm"
            fit="cover"
            style={{ flexShrink: 0 }}
          />
          <Stack gap={4} flex={1} style={{ minWidth: 0 }}>
            <Anchor
              fw={600}
              renderRoot={(props) => (
                <Link
                  to="/products/$productId"
                  params={{ productId: id }}
                  {...props}
                />
              )}
              data-testid="cart-item-name"
            >
              {name}
            </Anchor>
            <Text size="sm" c="dimmed" data-testid="cart-item-price">
              {unitPrice}
            </Text>
            {!available && (
              <Badge color="gray" w="fit-content">
                Нет в наличии
              </Badge>
            )}
          </Stack>
        </Group>
        <Group wrap="wrap" align="center" gap="md" ml="auto">
          <NumberInput
            value={quantity}
            min={1}
            max={maxQuantity}
            allowDecimal={false}
            allowNegative={false}
            clampBehavior="strict"
            disabled={!available}
            w={96}
            aria-label="Количество"
            onChange={(value) => {
              if (typeof value === "number") onQuantityChange(id, value);
            }}
            data-testid="cart-item-qty"
          />
          <Text fw={700} w={110} ta="right" data-testid="cart-item-total">
            {lineTotal}
          </Text>
          <Button
            variant="subtle"
            color="red"
            size="xs"
            onClick={() => onRemove(id)}
            data-testid="cart-item-remove"
          >
            Удалить
          </Button>
        </Group>
      </Group>
    </Card>
  );
}
