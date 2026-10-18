import { Box, Stack, Text, Title } from "@mantine/core";

export function CheckoutPage() {
  return (
    <Box p="xs" data-testid="checkout-page">
      <Title order={3} mb="md">
        Оформление заказа
      </Title>
      <Stack gap="md">
        <Text data-testid="checkout-order-composition">Состав заказа</Text>
        <Text data-testid="checkout-delivery">Способ доставки</Text>
        <Text data-testid="checkout-address">Адрес доставки</Text>
      </Stack>
    </Box>
  );
}
