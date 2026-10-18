import {
  Alert,
  Anchor,
  Box,
  Button,
  Center,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { routes } from "@/shared/config";
import { useCartRows } from "@/widgets/order-items";
import { CartItemRow } from "./CartItemRow";

export function CartPage() {
  const { isEmpty, isPending, hasLoadError, rows, total, setQuantity, removeItem } =
    useCartRows();

  if (isEmpty) {
    return (
      <Center mih="60vh" data-testid="cart-empty">
        <Stack align="center" gap="xs">
          <Text>Корзина пуста</Text>
          <Anchor component={Link} to={routes.catalog}>
            Перейти в каталог
          </Anchor>
        </Stack>
      </Center>
    );
  }

  if (isPending) {
    return (
      <Center mih="60vh">
        <Loader />
      </Center>
    );
  }

  return (
    <Box p="xs" data-testid="cart-page">
      <Title order={3} mb="md">
        Корзина
      </Title>
      {hasLoadError && (
        <Alert color="red" mb="md" data-testid="cart-error">
          Не удалось загрузить часть товаров
        </Alert>
      )}
      <Stack gap="md" data-testid="cart-list">
        {rows.map((row) => (
          <CartItemRow
            key={row.id}
            {...row}
            onQuantityChange={setQuantity}
            onRemove={removeItem}
          />
        ))}
      </Stack>
      <Group justify="flex-end" mt="lg" gap="md">
        <Text size="lg">Итого:</Text>
        <Text size="xl" fw={700} data-testid="cart-total">
          {total}
        </Text>
      </Group>
      <Group justify="flex-end" mt="md">
        <Button component={Link} to={routes.checkout} data-testid="cart-checkout">
          Оформить заказ
        </Button>
      </Group>
    </Box>
  );
}
