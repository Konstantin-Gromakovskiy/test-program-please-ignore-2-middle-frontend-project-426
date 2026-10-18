import {
  Alert,
  Anchor,
  Box,
  Center,
  Grid,
  Group,
  Loader,
  Paper,
  Title,
} from "@mantine/core";
import { Link, getRouteApi } from "@tanstack/react-router";
import { formatPrice } from "@/entities/product";
import { useGetOrderQuery } from "@/shared/api";
import { routes } from "@/shared/config";
import { OrderItems } from "@/widgets/order-items";
import { toOrderDelivery, toOrderRows } from "../lib/toOrderView";
import { OrderDeliveryInfo } from "./OrderDeliveryInfo";

const route = getRouteApi("/_authenticated/orders/$orderId");

export function OrderSuccessPage() {
  const { orderId } = route.useParams();
  const {
    data: order,
    isPending,
    isError,
  } = useGetOrderQuery({ path: { id: orderId } });

  if (isPending) {
    return (
      <Center mih="60vh">
        <Loader />
      </Center>
    );
  }

  if (isError) {
    return (
      <Box p="xs">
        <Alert color="red" data-testid="order-error">
          Не удалось загрузить заказ
        </Alert>
      </Box>
    );
  }

  return (
    <Box p="xs" data-testid="order-success-page">
      <Title order={3} mb="xs">
        Заказ оформлен
      </Title>
      <Title order={5} c="dimmed" fw={400} mb="md" data-testid="order-number">
        Номер заказа: {order.id}
      </Title>
      <Grid gap="md">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper withBorder p="md" h="100%">
            <Title order={4} mb="md">
              Состав заказа
            </Title>
            <OrderItems
              rows={toOrderRows(order)}
              total={formatPrice(order.total)}
            />
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper withBorder p="md" h="100%">
            <Title order={4} mb="md">
              Получение
            </Title>
            <OrderDeliveryInfo delivery={toOrderDelivery(order)} />
          </Paper>
        </Grid.Col>
      </Grid>
      <Group mt="lg">
        <Anchor
          renderRoot={(props) => (
            <Link to={routes.catalog} search={{ page: 1 }} {...props} />
          )}
        >
          Вернуться в каталог
        </Anchor>
      </Group>
    </Box>
  );
}
