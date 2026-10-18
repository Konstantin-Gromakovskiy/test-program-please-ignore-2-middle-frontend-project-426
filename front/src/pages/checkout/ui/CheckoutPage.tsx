import { Anchor, Box, Center, Loader, Stack, Text, Title } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { routes } from "@/shared/config";
import { OrderItems, useCartRows } from "@/widgets/order-items";

export function CheckoutPage() {
  const { isEmpty, isPending, rows, total } = useCartRows();

  if (isEmpty) {
    return (
      <Center mih="60vh" data-testid="checkout-empty">
        <Stack align="center" gap="xs">
          <Text>Корзина пуста, оформлять нечего</Text>
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
    <Box p="xs" data-testid="checkout-page">
      <Title order={3} mb="md">
        Оформление заказа
      </Title>
      <Stack gap="lg">
        <Stack gap="xs" data-testid="checkout-order-composition">
          <Title order={4}>Состав заказа</Title>
          <OrderItems rows={rows.filter((row) => row.available)} total={total} />
        </Stack>
        <Text data-testid="checkout-delivery">Способ доставки</Text>
        <Text data-testid="checkout-address">Адрес доставки</Text>
      </Stack>
    </Box>
  );
}
