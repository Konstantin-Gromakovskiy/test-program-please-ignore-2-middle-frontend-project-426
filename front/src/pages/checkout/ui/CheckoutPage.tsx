import {
  Anchor,
  Box,
  Center,
  Grid,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { Link } from '@tanstack/react-router'
import { routes } from '@/shared/config'
import { OrderItems, useCartRows } from '@/widgets/order-items'
import { CheckoutForm } from './CheckoutForm'

export function CheckoutPage() {
  const { isEmpty, isPending, rows, total } = useCartRows()

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
    )
  }

  if (isPending) {
    return (
      <Center mih="60vh">
        <Loader />
      </Center>
    )
  }

  const availableRows = rows.filter((row) => row.available)
  const lines = availableRows.map(({ id, quantity }) => ({
    productId: id,
    quantity,
  }))

  return (
    <Box p="xs" data-testid="checkout-page">
      <Title order={3} mb="md">
        Оформление заказа
      </Title>
      <Grid gap="md">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper withBorder p="md" h="100%">
            <Title order={4} mb="md">
              Получение
            </Title>
            <CheckoutForm lines={lines} />
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper
            withBorder
            p="md"
            h="100%"
            data-testid="checkout-order-composition"
          >
            <Title order={4} mb="md">
              Состав заказа
            </Title>
            <OrderItems rows={availableRows} total={total} />
          </Paper>
        </Grid.Col>
      </Grid>
    </Box>
  )
}
